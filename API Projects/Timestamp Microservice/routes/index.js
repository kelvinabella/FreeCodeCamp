exports.index = function(req, res){
  res.render('index')
}

exports.timestamp = function(req, res){
  var params = req.params.date
  var date = new Date(isNaN(params) ?  params : Number(params)*1000)
  var unix, natural, dateResponse
  var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]

  if(date instanceof Date && !isNaN(date.getTime())){
    unix = isNaN(params) ?
      Date.UTC(date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds())/1000
      : Number(params)
    natural = monthNames[date.getMonth()]
      + " "
      + date.getDate()
      + ", "
      + date.getFullYear()
  } else {
    unix = natural = null
  }

  dateResponse = {
    unix: unix,
    natural: natural
  }

  res.json(dateResponse)
}
