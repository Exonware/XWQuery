// Flux Examples
// InfluxData functional data scripting language

// Basic query
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "temperature")

// Aggregations
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "temperature")
  |> mean()

// Grouping
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "temperature")
  |> group(columns: ["location"])
  |> mean()

// Multiple aggregations
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "temperature")
  |> aggregateWindow(every: 5m, fn: mean)

// Joins
t1 = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "temperature")

t2 = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "humidity")

join(tables: {temp: t1, hum: t2}, on: ["_time", "location"])

// Transformations
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "temperature")
  |> map(fn: (r) => ({
    r with
    _value: r._value * 9.0 / 5.0 + 32.0,
    _field: "temperature_fahrenheit"
  }))

// Window operations
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "temperature")
  |> aggregateWindow(
    every: 5m,
    fn: mean,
    createEmpty: false
  )

// Pivot
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensors")
  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")

