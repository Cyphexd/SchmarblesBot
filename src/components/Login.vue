<template>
  <div>
    <div class="bg" />
    <div class="container">
      <button
        ref="loginButton"
        type="button"
        class="btn btn-twitch"
        @click.prevent="logIn"
      >
        <i class="fa fa-1x fa-twitch" /> Login with Twitch
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  mounted() {
    window.ipc.on('LOGIN_TWITCH_OK', this.handleLogin);
  },
  methods: {
    logIn() {
      window.ipc.send('LOGIN_TWITCH', {});

      this.$refs.loginButton.classList.toggle('button--loading');
    },

    handleLogin(data) {
      this.$refs.loginButton.classList.toggle('button--loading');

      if(data.status === 'success') {
        console.log(' Logged In ');
        this.$router.push("/dashboard");
      } else {
        console.log(' Not logged in! ');
      }
    }
  }
}
</script>


<style scoped>
.bg {
  position: fixed;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  width: 200%;
  height: 200vh;
  background: transparent url('http://assets.iceable.com/img/noise-transparent.png') repeat 0 0;
  background-repeat: repeat;
  animation: bg-animation .2s infinite;
  opacity: .9;
  visibility: visible;
}

@keyframes bg-animation {
    0% { transform: translate(0,0) }
    10% { transform: translate(-5%,-5%) }
    20% { transform: translate(-10%,5%) }
    30% { transform: translate(5%,-10%) }
    40% { transform: translate(-5%,15%) }
    50% { transform: translate(-10%,5%) }
    60% { transform: translate(15%,0) }
    70% { transform: translate(0,10%) }
    80% { transform: translate(-15%,0) }
    90% { transform: translate(10%,5%) }
    100% { transform: translate(5%,0) }
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.button--loading i
.button--loading .btn_text {
  visibility: hidden;
  opacity: 0;
}

.button--loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border: 4px solid transparent;
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: button-loading-spinner 1s ease infinite;
}

@keyframes button-loading-spinner {
  from {
    transform: rotate(0turn);
  }

  to {
    transform: rotate(1turn);
  }
}

button {
  font-size: 1.5rem;
  padding: 1rem 3rem;
  color: #f4f4f4;
  text-transform: uppercase;
}

.btn {
  text-decoration: none;
  border: 1px solid rgb(146, 148, 248);
  position: relative;
  overflow: hidden;
}

.btn:hover {
  box-shadow: 1px 1px 25px 10px rgba(146, 148, 248, 0.4);
}

.btn:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(146, 148, 248, 0.4),
    transparent
  );
  transition: all 650ms;
}

.btn:hover:before {
  left: 100%;
}

.btn-twitch { 
    color: #FFFFFF; 
    background-color: #6441A5; 
    border-color: #2F1F4E; 
    font-size: 1em;
}
.btn-twitch:hover, 
.btn-twitch:focus, 
.btn-twitch:active, 
.btn-twitch.active, 
.open .dropdown-toggle.btn-twitch { 
  color: #FFFFFF; 
  background-color: #472e75; 
  border-color: #2F1F4E; 
} 
 
.btn-twitch:active, 
.btn-twitch.active, 
.open .dropdown-toggle.btn-twitch { 
  background-image: none; 
} 
 
.btn-twitch.disabled, 
.btn-twitch[disabled], 
fieldset[disabled] .btn-twitch, 
.btn-twitch.disabled:hover, 
.btn-twitch[disabled]:hover, 
fieldset[disabled] .btn-twitch:hover, 
.btn-twitch.disabled:focus, 
.btn-twitch[disabled]:focus, 
fieldset[disabled] .btn-twitch:focus, 
.btn-twitch.disabled:active, 
.btn-twitch[disabled]:active, 
fieldset[disabled] .btn-twitch:active, 
.btn-twitch.disabled.active, 
.btn-twitch[disabled].active, 
fieldset[disabled] .btn-twitch.active { 
  background-color: #6441A5; 
  border-color: #2F1F4E; 
} 
.btn-twitch .badge { 
  color: #6441A5; 
  background-color: #FFFFFF; 
}

</style>