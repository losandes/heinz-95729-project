def startBlock(user_name):
    return([
            {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Hello, "+user_name+"!\n\n *Please add items to your cart.*"
            }
            },
            {
            "type": "divider"
            }
            
        ])

def additemBlock(quantity, unit, item):
    return ([
                        {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": quantity+" "+unit+" "+item+" added to your cart."
                        },
                        "accessory": {
                            "type": "image",
                            "image_url": "https://upload.wikimedia.org/wikipedia/commons/2/27/Green_apple.jpg",
                            "alt_text": item
                        }
                        },
                        {
                        "type": "divider"
                        }
                     ])

def additemProvideadetailsBlock():
    return ([
                    {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Please mention all the details.\nFor example: /additem 2 pound green apple"
                    },
                    "accessory": {
                        "type": "image",
                        "image_url": "https://media.giphy.com/media/4JVTF9zR9BicshFAb7/giphy.gif",
                        "alt_text": "add details"
                    }
                    },
                    {
                    "type": "divider"
                    }
                ])

def itemExceptionBlock(reply):
    return([
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": reply
      },
      "accessory": {
        "type": "image",
        "image_url": "https://media.giphy.com/media/sBGw5MruxAyiI/giphy.gif",
        "alt_text": "check again"
      }
    },
    {
      "type": "divider"
    }
  ]
)

def removeitemBlock(quantity, unit, item):
    return([
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": quantity+" "+unit+" "+item+ " removed."
      },
      "accessory": {
        "type": "image",
        "image_url": "https://media.giphy.com/media/l0Iy6sR1U7qVJVJ9S/giphy.gif",
        "alt_text": "removed"
      }
    },
    {
      "type": "divider"
    }
  ]
)

def removeitemProvideadetailsBlock():
    return ([
                    {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Please mention all the details.\nFor example: /removeitem 2 pound green apple"
                    },
                    "accessory": {
                        "type": "image",
                        "image_url": "https://media.giphy.com/media/4JVTF9zR9BicshFAb7/giphy.gif",
                        "alt_text": "add details"
                    }
                    },
                    {
                    "type": "divider"
                    }
                ])

def cancelOrderBlock():
    return([
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Your order has been cancelled!*"
      },
      "accessory": {
        "type": "image",
        "image_url": "https://media.giphy.com/media/xFoPm4TOLmJsiKoEQq/giphy.gif",
        "alt_text": ""
      }
    },
    {
      "type": "divider"
    }
  ]
)

def viewCartBlock(text):
    return ([
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*CART:*\n"+text
      },
      "accessory": {
        "type": "image",
        "image_url": "https://media.giphy.com/media/l0amJzVHIAfl7jMDos/giphy.gif",
        "alt_text": ""
      }
    },
    {
      "type": "divider"
    }
  ]
)

def viewTypesItemBlock(text):
    return([
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": text
      },
      "accessory": {
        "type": "image",
        "image_url": "https://media.giphy.com/media/l41lHUFy5JAe4nrOM/giphy.gif",
        "alt_text": ""
      }
    },
    {
      "type": "divider"
    }
  ]
)