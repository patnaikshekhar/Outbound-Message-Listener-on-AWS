const express = require('express')
const xmlparser = require('express-xml-bodyparser')
const AWS = require('aws-sdk')

const dynamodb = new AWS.DynamoDB({
  region: 'eu-west-2'
})

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
  
  addToDynamo(sobject)

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

const addToDynamo = (sobject) => {
  const account = {
    TableName: 'Account',
    Item: {
      Id: {
        S: sobject.id[0]
      },
      AccountNumber: {
        S: sobject.accountnumber[0]
      },
      Active: {
        S: sobject.active__c[0]
      }
    }
  }
  
  console.log(account)

  dynamodb.putItem(account, (err, data) => {
    console.log('Putting into dynamo', 'error = ', err, 'result = ', data)
  })
}

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running')
})
