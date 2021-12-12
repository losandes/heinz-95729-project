module.exports = {
  scope: 'heinz',
  name: 'loginComponent',
  dependencies: ['environment', 'Vue'],
  factory: (env, Vue) => {
    'use strict'

    const state = { email: '' }
    const apiRoute = `${env.get('apiOrigin')}/users/login`
    const component = Vue.component('login', {
      template: `
      <section class="tm-welcome-section2">
      <div class="container2">
      <form action="/action_page.php">
      <div class="row">
            <section class="tm-welcome-section2">
              <div class="row">
                      
                          <h4><b>Foodie's Choice of Restaurants! </b></h4>
                     
              </div>
              <div class="row">
                  
                      <h4><b>Overall Choice (result, no ML used!)</b></h4>
                      <fieldset>
                      <div class="item">
                      
                        <input type="checkbox" id="ch1" name="ch1" value="Moti Mahal">
                        <label for="ch1"> Moti Mahal</label>
                        
                      </div>
                      </fieldset>
                     
                      <p>
                 
                </div>
                <div class="row">
                  
                      <h4><b>More results (Recommender System)</b></h4>
                      <h4><b>Overlapping Recommendation</b></h4>
                        <div class="row">
                        <div class="col-md-4 align-self-center text-right">Standard India</div>
                        <p>
                        </div>
                        
                      <h4><b>Content-based Recommendation</b></h4>
                      <div class="row">
                        <div class="col-md-2 align-self-center text-right">Bukhara</div>
                        <div class="col-md-2 align-self-center text-right">Klay Oven</div>
                        <div class="col-md-2 align-self-center text-right">Udipi Palace</div>
                        <div class="col-md-2 align-self-center text-left">Bangkok Star</div>
                        <div class="col-md-2 align-self-center text-left">Standard India</div>
                        <div class="col-md-2 align-self-center text-left">Ethiopian Village</div>
                        <p></p>
                        </div>
                      <h4><b>User-based Recommendation</b></h4>
                      <div class="row">
                        <div class="col-md-2 align-self-center text-right">Hashalom</div>
                        <div class="col-md-2 align-self-center text-right">Hi Howe</div>
                        <div class="col-md-2 align-self-center text-right">Gandhi Indian</div>
                        <div class="col-md-2 align-self-center text-left">Penny's Noodle</div>
                        <div class="col-md-2 align-self-center text-left">Standard India</div>
                        <div class="col-md-2 align-self-center text-left">Pierogi Inn</div>
                        <p>
                      </div>
                    <button v-on:click="reservations" class="button4">GO TO RESERVATION CHECKOUT!</button> 
                </div> 
              </section>    
  </div>
  </form>
  </div>
  </section>
  `,
      data: function () {
        return state
      },
    })

    return { component }
  },
}
