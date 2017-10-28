const express = require('express')
const xmlparser = require('express-xml-bodyparser')

const app = express()

app.use(xmlparser({
  tagNameProcessors: [(name) => {
    if (name.indexOf(':') > -1) {
      return name.split(':')[1]
    } else {
      return name
    }
  }]
}))

app.post('/accounts', (req, res) => {
  
  const sobject = 
        req.body.envelope.body[0].notifications[0].notification[0].sobject[0]
  
  const id = sobject.id
  const accountNumber = sobject.accountnumber
  const active = sobject.active__c
  
  console.log(id, accountNumber, active)

  res.end(`
   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound">
   <soapenv:Header/>
   <soapenv:Body>
      <out:notificationsResponse>
         <out:Ack>true</out:Ack>
      </out:notificationsResponse>
   </soapenv:Body>
</soapenv:Envelope>
  `)
})

function parseBody(request) {
  if (typeof request == 'array') {
  } else if (typeof request == 'object') {
  }
}


app.listen(process.env.PORT, () => {
  console.log('Server is running')
})
