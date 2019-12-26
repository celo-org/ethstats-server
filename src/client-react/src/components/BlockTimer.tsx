import React, { useState } from "react"
import useInterval from "../hooks/useInterval"

const BlockTimer = ({receivedTime} : any) => {
  const calculateTimePassed = () =>
    ((+new Date() - +new Date(receivedTime)) / 1000).toFixed(0)
  const [timeLeft, setTimeLeft] = useState(null)

  useInterval(() => {
    // @ts-ignore
    setTimeLeft(calculateTimePassed() as number)
  }, 1000);

  return (
    <div>{timeLeft}</div>
  )
}

export default BlockTimer
