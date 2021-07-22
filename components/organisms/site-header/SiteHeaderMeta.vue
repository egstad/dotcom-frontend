<template>
  <div class="header-meta">
    <client-only>
      <Type :size="2" class="ts-mono" tag="span">{{ hour }}</Type>
      <Type :size="2" tag="span" class="meta-c">:</Type>
      <Type :size="2" class="ts-mono" tag="span">{{ minute }}</Type>
      <Type :size="2" tag="span"
        ><span class="meta-p">{{ period }}</span></Type
      >
      <!-- <Type :size="2" class="meta-m">{{ month }}&nbsp;</Type> -->
      <Type :size="2" class="meta-y ts-mono">{{ year }}</Type>
      <Type :size="2" tag="span"
        ><span class="meta-p">{{ month }}</span></Type
      >
    </client-only>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data() {
    return {
      date: dayjs(),
      interval: null,
      blink: true
    }
  },
  computed: {
    hour() {
      return this.date.format('h')
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
  beforeDestroy() {
    clearInterval(this.interval)
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
  opacity: 0.5;
  justify-content: flex-end;
  padding: 0.6em 0;

  > .ts-mono {
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em !important;
  }

  // month
  .meta-y {
    margin-left: 1.2em;
  }

  // period (am/pm)
  .meta-p {
    text-transform: uppercase;
    position: relative;
    top: -0.7em;
    line-height: 1;
    font-size: 0.5em;
    margin-left: 10%;
    letter-spacing: 0.1em;
  }

  .meta-c {
    position: relative;
    top: -0.1em;
    animation: blink infinite 1s ease-in-out;
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
