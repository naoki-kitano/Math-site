// The starter database helper is dormant while hosting.json has d1: null.
declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
  }
}
