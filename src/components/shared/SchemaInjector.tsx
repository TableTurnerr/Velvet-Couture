type Props = {
  schema: object | object[];
};

export default function SchemaInjector({ schema }: Props) {
  const json = Array.isArray(schema)
    ? schema.map((s) => JSON.stringify(s)).join("\n")
    : JSON.stringify(schema);

  if (Array.isArray(schema)) {
    return (
      <>
        {schema.map((s, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
          />
        ))}
      </>
    );
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
