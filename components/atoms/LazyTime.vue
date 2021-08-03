<template>
  <client-only>
    <div class="header-meta">
      <transition name="meta" mode="out-in">
        <p v-if="show" class="time">
          <span>{{ hour }}</span>
          <span class="blink">:</span>
          <span>{{ minute }}</span>
          <span>{{ period }}</span>
        </p>
      </transition>

      <transition name="meta" mode="out-in">
        <p v-if="show" class="date">
          <span>{{ month }}</span>
          <span>•</span>
          <span>{{ year }}</span>
        </p>
      </transition>
    </div>
  </client-only>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      date: dayjs(),
      interval: null,
      blink: true
    }
  },

  computed: {
    hour() {
      return this.date.format('hh')
    },
    minute() {
      return this.date.format('mm')
    },
    period() {
      return this.date.format('a')
    },
    month() {
      return this.date.format('MMM')
    },
    year() {
      return this.date.format('YYYY')
    }
  },
  created() {
    if (process.client) {
      this.interval = setInterval(() => {
        this.setTime()
      }, 10000)
    }
  },
  mounted() {
    console.log('inview')
  },
  beforeDestroy() {
    clearInterval(this.interval)
    console.log('bye')
  },
  methods: {
    setTime() {
      this.date = dayjs()
    }
  }
}
</script>

<style lang="scss">
.header-meta {
  display: flex;
  justify-content: flex-end;
  padding: 0.6em 0;
  text-transform: uppercase;

  p {
    display: flex;
    margin-left: calc(var(--header-item-gap) * 2);
    margin-right: calc(var(--header-item-gap) * 2);
    width: 100%;
    transform-origin: center right;

    @include transition {
      &.meta-enter-active,
      &.meta-leave-active {
        transition: width var(--trans-short) var(--trans-delay) var(--ease),
          transform var(--trans-short) var(--trans-delay) var(--ease),
          opacity var(--trans-short) var(--trans-delay) var(--ease),
          margin var(--trans-short) var(--trans-delay) var(--ease);
      }
      &.meta-enter,
      &.meta-leave-to {
        transform: scale(0);
        width: 0;
        opacity: 0;
        margin-left: 0;
      }
    }

    &.date {
      margin-left: 0;
    }
  }

  .blink {
    position: relative;
    top: -0.1em;

    @include transition {
      animation: blink infinite 1s ease-in-out;
    }
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }
}
</style>
