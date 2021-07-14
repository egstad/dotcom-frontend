<template>
  <nav class="nav-primary">
    <ul
      v-for="(linkGroup, index) in links"
      :key="index"
      class="nav-primary__list"
    >
      <template v-for="(link, linkIndex) in linkGroup">
        <Type :key="linkIndex" tag="li" class="nav-primary__item" :size="1">
          <nuxt-link class="nav-primary__link" :to="{ path: link.route }">
            {{ link.title }}</nuxt-link
          >
        </Type>
      </template>
    </ul>

    <!-- <p v-if="activeItem">active: {{ activeItem }}</p> -->
  </nav>
</template>

<script>
export default {
  data() {
    return {
      links: [
        [
          {
            title: 'Work',
            route: '/'
          },
          {
            title: 'Commercial',
            route: '/'
          },
          {
            title: 'Personal',
            route: '/'
          },
          {
            title: 'Typography',
            route: 'typography'
          },
          {
            title: 'Grid',
            route: 'grid'
          }
        ],
        [
          {
            title: 'Information',
            route: 'profile'
          },
          {
            title: 'Profile',
            route: 'profile'
          },
          {
            title: 'Colophon',
            route: 'profile'
          }
        ],
        [
          {
            title: 'Contact',
            route: 'contact'
          },
          {
            title: 'Profile',
            route: 'contact'
          },
          {
            title: 'Colophon',
            route: 'contact'
          }
        ]
      ]
    }
  }
}
</script>

<style lang="scss">
.nav-primary {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}

.nav-primary__list {
  list-style-type: none;
  padding: 0.4em 0;
}

.nav-primary__link {
  display: inline-block;
  color: var(--foreground);
  text-decoration: none;
  opacity: 0.5;
  transition: color var(--time) var(--ease);

  html.is-touch & {
    padding: 0.4em 0;
  }

  &:hover {
    opacity: 1;
  }
}

.nuxt-link-exact-active {
  opacity: 1;
}
</style>
