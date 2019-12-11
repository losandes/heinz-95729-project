module.exports = function Bot (Adventure) {
  const bot = new Adventure()

  bot.question('how are you today?')
    .then((answer) => {
        if (answer==="don't repeat"){
            console.log('i can only repeat')
        }
        else{
            console.log(`You said, ${answer}`)
        }
        console.log()
        console.log('Checkout `https://github.com/losandes/terminal-adventure` for more information on how to use Terminal Adventure')
        console.log()
        bot.complete()
    })

}
