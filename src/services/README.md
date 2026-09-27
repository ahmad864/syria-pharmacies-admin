# Services layer

Each file here is the single place a future real API call for that domain
will live. Every exported function already has the exact signature/return
type the UI expects — only the *implementation* needs to change when this
is wired to Laravel (swap `mockDelay()` + mock array slicing for a real
`fetch`/`ApiClient` call that hits the matching Laravel endpoint).

Nothing outside `src/services/` and `src/mock/` should ever import from
`src/mock/` directly — pages/hooks call a service function, never a mock
array. That's what makes deleting the mock layer later a one-file-per-domain
change instead of a project-wide refactor.

No endpoint paths are hardcoded here — see `TODO(api)` comments for where
a real request will be made.
