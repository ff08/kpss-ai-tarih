import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

/**
 * Basit **kalın** ve satır sonu desteği (bilgi kartı içeriği için).
 */
export function MdText({ children, style, ...rest }: TextProps) {
  const text = typeof children === "string" ? children : "";
  if (!text) {
    return <Text style={style} {...rest} />;
  }
  const lines = text.split("\n");
  return (
    <Text style={style} {...rest}>
      {lines.map((line, lineIdx) => (
        <Text key={lineIdx}>
          {lineIdx > 0 ? "\n" : null}
          <LineParts text={line} />
        </Text>
      ))}
    </Text>
  );
}

function LineParts({ text }: { text: string }) {
  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {segments.map((seg, i) => {
        const m = seg.match(/^\*\*(.+)\*\*$/);
        if (m) {
          return (
            <Text key={i} style={styles.bold}>
              {m[1]}
            </Text>
          );
        }
        return <Text key={i}>{seg}</Text>;
      })}
    </>
  );
}

const styles = StyleSheet.create({
  bold: { fontWeight: "700" },
});
