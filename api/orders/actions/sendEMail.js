module.exports.name = 'sendEmail'
module.exports.dependencies = ['nodemailer', 'ejs', 'getUser', 'nconf']
module.exports.factory = function (nodemailer, ejs, getUser, nconf) {
  'use strict'
  const { getUserByID } = getUser

  const sendEmail = (order, uid) => {
    
    //Retrieve mailtrap SMTP credentials
    const env = nconf
    .argv()
    .env()
    .file('environment', './common/environment/email_cred.json')

    //create smtp transporter object
    let transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: env.get('user'), 
        pass: env.get('pass')
      }
    });
    
    new Promise(getUserByID(uid))
      .then(user => {
        
        ejs.renderFile(
          'orders/email-templates/default.ejs', 
          {
            order: order,
            user: user,
            clientPort: env.get('client_port'), 
          },
       
          function (err, html) {
       
            if (err) {
              // reject if an error happens
              console.log(err);
            }

            var mailOptions = {
              from: '"BookStore" <bookstore-b2af49@inbox.mailtrap.io>',
              to: user.email,
              subject: "BookStore - Your Order ",
              html: html
            };
            
            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
            
          }
        );
      })
  }

  return { sendEmail }
}
