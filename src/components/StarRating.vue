
<template>
  <div class="rating-component">
     <div class="rating">
        <span class="grade" v-if="hasCounter">{{stars}}</span>
        <ul class="list">
          <li :key="star" v-for="star in maxStars">
            <i :class="{ 'active': star <= stars }" class="icon-star" scale="2" :name="star <= stars ? 'star' : 'star-o'"/>
        </li>
        </ul>
    </div>
    </div>
</template>
<script>
export default {
     props: {
      grade: {
        type: Number,
        required: true
      },
      maxStars: {
        type: Number,
        default: 5
      },
      hasCounter: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        stars: this.grade
      }
    },
    methods: {
      rate(star) {
        if (
          star === 'number' &&
          star <= this.maxStars &&
          star >= 0
        )
          this.stars = this.stars === star ? star - 1 : star
      }
    }
}
</script>
