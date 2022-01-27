import React from 'react'
import moment from 'moment'

export const getTimeFromNow = (timestamp: Date) => {
  const hour = moment(timestamp).seconds()

  if (moment(timestamp).diff(moment.now(), 'seconds') * -1 < 60) {
    return `${moment(timestamp).diff(moment.now(), 'seconds') * -1}s`
  } else if (moment(timestamp).diff(moment.now(), 'minutes') * -1 < 60) {
    return `${moment(timestamp).diff(moment.now(), 'minutes') * -1}m`
  } else if (moment(timestamp).diff(moment.now(), 'hours') * -1 < 24) {
    return `${moment(timestamp).diff(moment.now(), 'hours') * -1}h`
  } else if (moment(timestamp).diff(moment.now(), 'days') * -1 < 7) {
    return `${moment(timestamp).diff(moment.now(), 'days') * -1}d`
  }
  return convertDate(timestamp)
}

export const convertDate = (timestamp: Date) => {
  return moment(timestamp).calendar()
}
