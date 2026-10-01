# Artifact Provenance

This directory is the audit trail between the ChatGPT research conversation and the structured repository.

## Policy

The repository does **not** need to mirror every generated filename byte-for-byte to preserve history. Instead:

1. human-readable reports are archived as dated reports;
2. important superseded source snapshots are retained under `artifacts/source/` or `artifacts/archive/`;
3. large intermediate exports may be normalized into canonical datasets;
4. every source artifact is listed in `source-manifest.json` with its original filename, date, size, SHA-256 checksum and repository representation;
5. living conclusions belong under `docs/`; archived artifacts are evidence, not current truth.

This gives the project both reproducibility and a readable history without turning the repository into an unstructured dump of ChatGPT downloads.
