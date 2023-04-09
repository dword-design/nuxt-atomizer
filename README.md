<!-- TITLE/ -->
# nuxt-atomizer
<!-- /TITLE -->

<!-- BADGES/ -->
  <p>
    <a href="https://npmjs.org/package/nuxt-atomizer">
      <img
        src="https://img.shields.io/npm/v/nuxt-atomizer.svg"
        alt="npm version"
      >
    </a><img src="https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue" alt="Linux macOS Windows compatible"><a href="https://github.com/dword-design/nuxt-atomizer/actions">
      <img
        src="https://github.com/dword-design/nuxt-atomizer/workflows/build/badge.svg"
        alt="Build status"
      >
    </a><a href="https://codecov.io/gh/dword-design/nuxt-atomizer">
      <img
        src="https://codecov.io/gh/dword-design/nuxt-atomizer/branch/master/graph/badge.svg"
        alt="Coverage status"
      >
    </a><a href="https://david-dm.org/dword-design/nuxt-atomizer">
      <img src="https://img.shields.io/david/dword-design/nuxt-atomizer" alt="Dependency status">
    </a><img src="https://img.shields.io/badge/renovate-enabled-brightgreen" alt="Renovate enabled"><br/><a href="https://gitpod.io/#https://github.com/dword-design/nuxt-atomizer">
      <img
        src="https://gitpod.io/button/open-in-gitpod.svg"
        alt="Open in Gitpod"
        width="114"
      >
    </a><a href="https://www.buymeacoffee.com/dword">
      <img
        src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
        alt="Buy Me a Coffee"
        width="114"
      >
    </a><a href="https://paypal.me/SebastianLandwehr">
      <img
        src="https://sebastianlandwehr.com/images/paypal.svg"
        alt="PayPal"
        width="163"
      >
    </a><a href="https://www.patreon.com/dworddesign">
      <img
        src="https://sebastianlandwehr.com/images/patreon.svg"
        alt="Patreon"
        width="163"
      >
    </a>
</p>
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
Module that adds ACSS atomic CSS framework (aka Atomizer) support to a Nuxt.js app. Generates atomic classes from code.
<!-- /DESCRIPTION -->

<!-- INSTALL/ -->
## Install

```bash
# npm
$ npm install nuxt-atomizer

# Yarn
$ yarn add nuxt-atomizer
```
<!-- /INSTALL -->

## Usage

Add the module to your Nuxt.js modules list in nuxt.config.js:

```js
export default {
  modules: [
    'nuxt-atomizer',
  ],
}
```

That's already it, now you can add atomic classes to your components and they are generated on the fly!

```html
<template>
  <div class="P(2rem) Bgc(#fafafa) C(#111) Bd Bdw(2px) Bdc(#ccc) Bdrs(.5rem) Ff(ss)">
    Hey there, I'm styled with ACSS! 🙌
  </div>
</template>
```

Here is the result:

<img alt="Screenshot of a box with rounded corners, displaying the text 'Hey there, I'm styled with ACSS! 🙌'" src="https://github.com/dword-design/nuxt-atomizer/blob/master/doc/screenshot.jpg" width="600">

Also check out the demo at [CodeSandbox](https://codesandbox.io/s/demo-nuxt-atomizer-k8cky).

## Options

You can customize Atomic CSS by adding options either to the module or top-level options. It takes the same options as [webpack-atomizer-loader](https://github.com/acss-io/webpack-atomizer-loader#atomic-css-configuration).

```js
export default {
  modules: [
    ['nuxt-atomizer', {
      breakPoints: {
        sm: '@media screen(min-width=750px)',
        md: '@media(min-width=1000px)',
        lg: '@media(min-width=1200px)'
      },
      custom: {
        primary: 'red',
      },
    }],
  ],
  atomizer: {
    /* options */
  },
}
```

```html
<template>
  <div class="C(primary)">I am red now</div>
</template>
```

<!-- LICENSE/ -->
## Contribute

Are you missing something or want to contribute? Feel free to file an [issue](https://github.com/dword-design/nuxt-atomizer/issues) or a [pull request](https://github.com/dword-design/nuxt-atomizer/pulls)! ⚙️

## Support

Hey, I am Sebastian Landwehr, a freelance web developer, and I love developing web apps and open source packages. If you want to support me so that I can keep packages up to date and build more helpful tools, you can donate here:

<p>
  <a href="https://www.buymeacoffee.com/dword">
    <img
      src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
      alt="Buy Me a Coffee"
      width="114"
    >
  </a>&nbsp;If you want to send me a one time donation. The coffee is pretty good 😊.<br/>
  <a href="https://paypal.me/SebastianLandwehr">
    <img
      src="https://sebastianlandwehr.com/images/paypal.svg"
      alt="PayPal"
      width="163"
    >
  </a>&nbsp;Also for one time donations if you like PayPal.<br/>
  <a href="https://www.patreon.com/dworddesign">
    <img
      src="https://sebastianlandwehr.com/images/patreon.svg"
      alt="Patreon"
      width="163"
    >
  </a>&nbsp;Here you can support me regularly, which is great so I can steadily work on projects.
</p>

Thanks a lot for your support! ❤️

## See also

* [nuxt-mail](https://github.com/dword-design/nuxt-mail): Adds email sending capability to a Nuxt.js app. Adds a server route, an injected variable, and uses nodemailer to send emails.
* [nuxt-route-meta](https://github.com/dword-design/nuxt-route-meta): Adds Nuxt page data to route meta at build time.
* [nuxt-mermaid-string](https://github.com/dword-design/nuxt-mermaid-string): Embed a Mermaid diagram in a Nuxt.js app by providing its diagram string.
* [nuxt-content-git](https://github.com/dword-design/nuxt-content-git): Additional module for @nuxt/content that replaces or adds createdAt and updatedAt dates based on the git history.
* [nuxt-babel-runtime](https://github.com/dword-design/nuxt-babel-runtime): Nuxt CLI that supports babel. Inspired by @nuxt/typescript-runtime.

## License

[MIT License](https://opensource.org/licenses/MIT) © [Sebastian Landwehr](https://sebastianlandwehr.com)
<!-- /LICENSE -->
