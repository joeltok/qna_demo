/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import io from 'socket.io-client'

class App extends Component {
  constructor (props) {
    super(props)
    var that = this

    this.state = {
      messages: [],
      currentMessage: ''
    }

    this.socket = io('http://localhost:9000')
    this.socket.on('connect', () => {
      console.log('connected')
    })

    let addAnswer = (data) => {
      let messages = that.state.messages
      messages.push({
        agent: 'Guilty Spark 343',
        message: data
      })
      that.setState({
        messages: messages
      })
    }
    this.socket.on('greeting', addAnswer)
    this.socket.on('answer', addAnswer)
    this.socket.on('disconnect', () => {
      console.log('disconnected')
    })
  }

  handleChange (e) {
    this.setState({
      currentMessage: e.target.value
    })
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.socket.emit('question', this.state.currentMessage)

      console.log(`Submitted: ${this.state.currentMessage}`)
      let messages = this.state.messages
      messages.push({
        agent: 'Me',
        message: this.state.currentMessage
      })
      this.setState({
        messages: messages,
        currentMessage: ''
      })
    }
  }

  render () {
    const styles = {
      container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 200,
        marginBottom: 200
      },
      subContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: 600,
        marginBottom: 40
      },
      agent: {
        flex: 1,
        fontWeight: 'bold',
        marginBottom: 5
      },
      message: {
        flex: 1

      },
      textInput: {
        flex: 1
      }
    }

    let conversation = this.state.messages.map((message, index) => {
      return (
        <div key={index} style={styles.subContainer}>
          <div style={styles.agent}>{message.agent}: </div>
          <div style={styles.message}>{message.message}</div>
        </div>
      )
    })

    let chatBox = (
      <div style={styles.subContainer}>
        <input
          type='text'
          value={this.state.currentMessage}
          onChange={this.handleChange.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
        />
      </div>
    )

    return (
      <div className="App" style={styles.container}>
        {conversation}
        {chatBox}
      </div>
    )
  }
}

export default App
