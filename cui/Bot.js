module.exports = function Bot (Adventure) {
  const bot = new Adventure()

  bot.question('hello world!')
    .then(answer => {
      console.log(`You said, ${answer}`)
      console.log()
      console.log('Checkout `https://github.com/losandes/terminal-adventure` for more information on how to use Terminal Adventure')
      console.log()
      bot.complete()
    })
}