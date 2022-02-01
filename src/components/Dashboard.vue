<template>
    <div>
        <div class="bg"></div>
        <div class="container">
            <h1 data-text="Marbles Bot" class="title"><span>Marbles Bot</span></h1>
                <div class="row">
                    <div class="input-group mb-3">
                        <button class="btn btn-outline-secondary" type="button" id="button-addon1" @click.prevent="connectToChannel">Join Channel</button>
                        <input ref="connectToChannelInput" type="text" class="form-control" placeholder="" />
                    </div>
                </div>

                <div class="row">
                <div class="table-responsive">
                    <table class="table table-dark table-striped table-hover table-bordered table-borderless caption-top">
                    <caption>Current Channels</caption>
                    <thead>
                        <tr>
                            <th scope="col" class="col-md-2">Channel</th>
                            <th scope="col" class="col-md-1">Rounds</th>
                            
                            <th scope="col">Status</th>
                            <th scope="col">Message</th>
                            <th scope="col">Req. Messages</th>
                            <th scope="col">Max Delay</th>
                            <th scope="col" class="col-md-3" style="text-align: center;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="game in games" :key="game.channel">
                             <th scope="row">{{ game.channel }}</th>
                            <td>{{ game.rounds }}</td>
                            <td>{{ game.status }}</td>
                            <td>{{ game.message }}</td>

                            <td>{{ game.minReqMsg }}</td>
                            <td>{{ game.minMsgDelay }}</td>
                            
                            <td style="text-align: center;">
                                <button class="btn btn-primary btn-sm action" @click="toggleGame(game.channel)" >
                                    <i :class="[ 'fas', game.isRunning ? 'fa-pause' : 'fa-play' ]" ></i>
                                </button>
                                 <button class="btn btn-warning btn-sm action" @click="editGameSettings(game.channel)" >
                                    <i class="fas fa-wrench" ></i>
                                </button>
                                
                                 <button class="btn btn-danger btn-sm action" @click="removeGame(game.channel)" >
                                    <i class="fas fa-trash-alt" ></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Dashboard',
    data() {
        return {
            games: [],
            intervalid1: 0
        }
    },
   
    mounted() {
        window.ipc.on('TWITCH_CHANNEL', this.handleTwitchChannel);
    },
    methods: {
        handleTwitchChannel(message) {
            const {command, data} = message;
            switch(command) {
                case 'JOIN_SUCCESS': {
                    this.refreshGames();
                } break;
                case 'JOIN_FAIL': {
                    console.log('JOIN FAILED');
                } break;
                case 'LIST_GAMES_OK': {
                    this.games = data;
                } break;
                case 'REMOVE_GAME_OK':
                case 'CHANGE_MIN_MESSAGES_OK':
                case 'CHANGE_MIN_MESSAGE_DELAY_OK':
                case 'TOGGLE_PLAY_GAME_OK':
                case 'UPDATE_GAME': {
                    this.refreshGames();
                } break;
                default:
                    break;
            }
        },

        connectToChannel() {
            const channel = this.$refs.connectToChannelInput.value;
            if(channel && channel !== 'undefined') {
                const _opts = {
                        command: 'JOIN',
                        data: this.$refs.connectToChannelInput.value
                }
                window.ipc.send('TWITCH_CHANNEL', _opts);
            }
        },

        refreshGames() {
            this.msgChanged = false;

            const _opts = {
                    command: 'LIST_GAMES'
            }
            window.ipc.send('TWITCH_CHANNEL', _opts);

            if(this.intervalid1 == 0) {
                this.intervalid1 = setInterval(function(){
                    this.refreshGames();
                }.bind(this), 3000);
            }
        },

        toggleGame(channel) {
            const _opts = {
                    command: 'TOGGLE_PLAY_GAME',
                    data: channel
            }
            window.ipc.send('TWITCH_CHANNEL', _opts);
        },

        removeGame(channel) {
            const _opts = {
                    command: 'REMOVE_GAME',
                    data: channel
            }
            window.ipc.send('TWITCH_CHANNEL', _opts);
        },

        async editGameSettings(channel) {
            
            
            await this.$prompt("Input new Message", '!play', 'Change Message').then(text => {
                if(text) {
                    const _opts = {
                        command: 'CHANGE_MESSAGE',
                        data: {
                            channel: channel,
                            message: text
                        }
                    }
                    window.ipc.send('TWITCH_CHANNEL', _opts);
                }
            });

            await this.$prompt("Adjust Min required Messages", '3', 'Change min. required messages').then(text => {
                if(text) {
                    const _opts = {
                        command: 'CHANGE_MIN_MESSAGES',
                        data: {
                            channel: channel,
                            message: text
                        }
                    }
                    window.ipc.send('TWITCH_CHANNEL', _opts);
                }
            });

            await this.$prompt("Adjust min delay between messages in seconds", '10', 'Change min. delay').then(text => {
                if(text) {
                    const _opts = {
                        command: 'CHANGE_MIN_MESSAGE_DELAY',
                        data: {
                            channel: channel,
                            message: text
                        }
                    }
                    window.ipc.send('TWITCH_CHANNEL', _opts);
                }
            });
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
  z-index: -999;
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
  margin-top: 10px;
}

.container h1.title {
  text-align: center;
}

.container h1 {
    position: relative;
    font-family: 'Montserrat', Arial, sans-serif;
    font-size: calc(20px + 5vw);
    font-weight: 800;
    color: #fff;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    text-shadow: 0 0 0.15em #1da9cc;
    user-select: none;
    white-space: nowrap;
    filter: blur(0.007em);
    animation: shake 2.5s linear forwards;
    margin-bottom: 20px;
}

@keyframes shake {
    5%, 15%, 25%, 35%, 55%, 65%, 75%, 95% {
        filter: blur(0.018em);
        transform: translateY(0.018em) rotate(0deg);
    }

    10%, 30%, 40%, 50%, 70%, 80%, 90% {
        filter: blur(0.01em);
        transform: translateY(-0.018em) rotate(0deg);
    }

    20%, 60% {
        filter: blur(0.03em);
        transform: translate(-0.018em, 0.018em) rotate(0deg);
    }

    45%, 85% {
        filter: blur(0.03em);
        transform: translate(0.018em, -0.018em) rotate(0deg);
    }

    100% {
        filter: blur(0.007em);
        transform: translate(0) rotate(-0.5deg);
    }
}

.action {
    margin-left: 5px;
}
</style>