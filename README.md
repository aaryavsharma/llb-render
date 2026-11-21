# llb-render

Renders explainer videos in the cloud with [HyperFrames](https://hyperframes.heygen.com): one GitHub Actions machine per chunk, all at once.

This repo holds only the render setup. The video content (built compositions) comes from a public Google Drive folder at render time, and the rendered chunks come back as workflow artifacts (kept 3 days). Nothing here is the study material itself.

Started from the private project with `node tools/cloud-render.mjs <subject> <id> <chunks…>`.
