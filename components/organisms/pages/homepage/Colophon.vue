<template>
  <div class="colophon">
    <nav class="links">
      <a
        v-for="(link, linkIndex) in connectLinks"
        :key="'link' + linkIndex"
        :href="link.url"
        class="pill t-1"
        target="_blank"
        >{{ link.text }}</a
      >
    </nav>

    <div class="t-1 design">
      <strong>DESIGN</strong> • This website is set in Methaphor, a typeface I
      drew for readabilty. This site was designed in Figma in 2021 and is
      open-sourced here.
    </div>

    <div class="t-1 tech">
      <strong>TECHNOLOGY</strong> • Nuxt.js, Sanity.io, Netlify, Github, and a
      S3 bucket (used as a video CDN) are what make this site possible.
    </div>

    <footer class="t-1 footer">
      <h6>
        Egstad&nbsp;&copy;&nbsp;<span>2010-{{ date }}</span>
      </h6>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      connectLinks: [
        {
          text: 'Email',
          url: 'mailto:jordan@egstad.com'
        },
        {
          text: 'Instagram',
          url: 'https://instagram.com/jordanegstad'
        },
        {
          text: 'Are.na',
          url: 'https://are.na/jordan-egstad'
        }
      ]
    }
  },
  computed: {
    date() {
      const date = new Date()
      return date.getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
.colophon {
  width: calc(100% - var(--button-click-offset) * 2);
  margin-left: var(--button-click-offset);

  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: var(--button-click-offset);

  @include bp($xl) {
    border-top: 1px solid var(--foreground);

    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;

    padding-top: 1vw;
    // padding-bottom: 1vw;
  }
}

.links {
  border-top: 1px solid var(--foreground);
  border-bottom: 1px solid var(--foreground);
  grid-column: span 6;
  display: flex;
  justify-content: space-between;

  @include bp($xl) {
    align-self: center;
    justify-content: flex-start;
    grid-column: span 1;
    border: 0;
    margin-bottom: 1vw;
  }
}

.pill {
  @extend .t-mono;

  /* Positioning */
  position: relative;

  /* Display & Box Model */
  width: 100%;
  display: flex;
  justify-content: center;
  flex: 1;
  padding: 0.76em 1em;
  margin-top: 3vw;
  margin-bottom: 3vw;
  margin-right: 0.6em;
  border-radius: 100vw;

  @include bp($lg) {
    margin-top: 1.5vw;
    margin-bottom: 1.5vw;
    padding: 0.76em 1em;
  }

  @include bp($xl) {
    margin-top: 0;
    margin-bottom: 0;
    flex: 0;
    padding: 0 1.5em;
    height: var(--button-height);
    line-height: var(--button-height);
  }

  @include bp($xx) {
    padding: 0 2.5em;
  }

  &:last-child {
    margin-right: 0;
  }

  /* Color */
  background-color: var(--foreground);
  color: var(--background);

  @include transition {
    transition: background-color var(--transition-page),
      color var(--transition-page);
  }

  /* Text */
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.footer,
.design,
.tech {
  padding-top: 4vw;
  padding-bottom: 4vw;
  grid-column: span 3;

  @include bp($md) {
    padding-top: 2.5vw;
    padding-bottom: 2.5vw;
  }

  @include bp($lg) {
    padding-top: 1.5vw;
    padding-bottom: 1.5vw;
    grid-column: span 2;
  }

  @include bp($xl) {
    grid-column: span 1;
    padding: 0;
    padding-bottom: 1vw;
  }

  strong {
    font-variation-settings: 'wght' 1000;
  }
}

.footer {
  @extend .t-mono;
  font-variant-numeric: tabular-nums;
  border-top: 1px solid var(--foreground);
  grid-column: span 6;
  text-transform: uppercase;
  letter-spacing: 0;

  @include bp($lg) {
    border-top: 0;
    padding-top: 1.5vw;
    padding-bottom: 1.5vw;
    grid-column: span 2;
  }

  @include bp($xl) {
    grid-column: span 3;
    border-top: 1px solid var(--foreground);
  }
}
</style>