# nomadder-client
A web based nomadic data sharing framework between non-internet connected servers

## Usage

The usage principle of the nomadder client is very intuitive to set up. 
One can simply call the setupEventListener and the client is ready to go. For example:
```
initializeNommaderClient(example.url)
sendSyncEvent()
```
And the client is ready to listen to messages from the designated web socket.

The client has two data that is stores in the local strage, which can be categorized as identity data and nomadder data, named NOMADDER-IDENTITY and NOMADDER-DATA respectively. 

### Nomadder data

The NOMADDER-DATA fields holds the data recieved from the batch event from the server. The purpose of the client is to store and transport this data to other servers.
The sendSyncEvent() sends all the data stored in the NOMADDER-DATA field and triggers the server to send a batch event. The data in the batch event replace the old data in the NOMADDER-DATA field.
The server is responsible to decide the data that the client should carry.



### Identity data
Identity data, with the name NOMADDER-IDENTITY in the local storage, holds data that is unique to the client. Unique data can be accessed using the following function:
```
sendIdentityEvent(<data ID>, <collection name>)
```

It is also possible to send the identity data stored localy on the client to the server using the following function:

```
sendIdentitySyncEvent()
```
Unlike the NOMADDER-DATA, the identity event request for a unique data, so the client is responsible for choosing the data. 
