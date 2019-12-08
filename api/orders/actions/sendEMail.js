module.exports.name = 'sendEmail'
module.exports.dependencies = ['nodemailer', 'ejs', 'getUser']
module.exports.factory = function (nodemailer, ejs, getUser) {
  'use strict'
  const { getUserByID } = getUser

  const sendEmail = (order, uid, baseURL) => {
  
    let transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: 'bb8518e226eaa8', 
        pass: '44182d222ed015' 
      }
    });

    new Promise(getUserByID(uid))
      .then(user => {
        ejs.renderFile(
          'orders/email-templates/default.ejs', 
          {
            order: order,
            baseURL: baseURL,
            user: user
          },
       
          function (err, html) {
       
            if (err) {
              // reject if an error happens
              console.log(err);
            }

            
            var mailOptions = {
              from: '"BookStore" <bookstore-b2af49@inbox.mailtrap.io>', // sender address
              to: "peteryef@andrew.cmu.edu", // list of receivers
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
