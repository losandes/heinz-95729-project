module.exports = {
  scope: 'heinz',
  name: 'homeComponent',
  dependencies: ['Vue', 'locale'],
  factory: (Vue, locale) => {
    'use strict'

    const component = Vue.component('home', {
      template: `
      <section class="tm-welcome-section">
      <div class="container tm-position-relative">
        <div class="tm-lights-container">
          <img src="/images/restaurants/light.png" alt="Light" class="light light-1" width="600" height="100">
          <img src="/images/restaurants/light.png" alt="Light" class="light light-2">
          <img src="/images/restaurants/light.png" alt="Light" class="light light-3">  
        </div>        
        <div class="row tm-welcome-content">
          <h2 class="white-text tm-handwriting-font tm-welcome-header"><img src="/images/restaurants/header-line.png" alt="Line" class="tm-header-line">&nbsp;Welcome To&nbsp;&nbsp;<img src="/images/restaurants/header-line.png" alt="Line" class="tm-header-line"></h2>
          <h2 class="gold-text tm-welcome-header-2">Foodie</h2>
         
        </div>  
        <div class="row tm-welcome-content">
        <a href="#main" class="tm-more-button tm-more-button-welcome">Find Restaurants!</a>
        </div>      
      </div>      
      
      
      </div>
      </section>
      <select name="LeaveType" v-model="leaveType" @change="onChange()" class="form-control">
           <option value="1">Annual Leave/ Off-Day</option>
           <option value="2">On Demand Leave</option>
      </select>
      <script>
        export default {
    data() {
        return {
            leaveType: '',
        }
    },

    methods: {
        onChange() {
            console.log('The new value is: ', this.leaveType)
        }
    }
}
</script>
      `,
    StyleSheet: "",
      data: () => {
        return {
          heading: locale.pages.home.heading,
          body: locale.pages.home.body,
        }
      },
    })

    return { component }
  },
}