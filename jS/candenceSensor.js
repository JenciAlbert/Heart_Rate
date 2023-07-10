(function () {
  "use strict";

  class CadenceSensor {
    constructor() {
      this.device = null;
      this.server = null;
      this._characteristics = new Map();
    }
    connect() {
      return navigator.bluetooth
        .requestDevice({
          filters: [{ services: ["cycling_speed_and_cadence"] }],
        })
        .then((device) => {
          this.device = device;
          return device.gatt.connect();
        })
        .then((server) => {
          this.server = server;
          return server.getPrimaryService("cycling_speed_and_cadence");
        })
        .then((service) => {
          return this._cacheCharacteristic(service, "csc_measurement");
        });
    }

    /* Cycling Speed and Cadence Service */

    startNotificationsCscMeasurement() {
      return this._startNotifications("csc_measurement");
    }
    stopNotificationsCscMeasurement() {
      return this._stopNotifications("csc_measurement");
    }
    parseCadence(value) {
      // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
      value = value.buffer ? value : new DataView(value); // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
      const flagField = value.getUint8(0);
      let result = {};
      result.flagField = flagField;
      let index = 1;

      switch (flagField) {
        case 1: // Sensor is Wheel revolution sensor
          result.cumulativeWheelRevolutions = value.getUint32(
            index,
            /*littleEndian=*/ true
          );
          index += 4;
          result.wheelTimeStamp = value.getUint16(
            index,
            /*littleEndian=*/ true
          );
          break;

        case 2: // Sensor is Crank revolution sensor
          result.cumulativeCrankRevolutions = value.getUint16(
            index,
            /*littleEndian=*/ true
          );
          index += 2;
          result.crankTimeStamp = value.getUint16(
            index,
            /*littleEndian=*/ true
          );
          break;

        case 3: // Sensor is Wheel and Crank revolution sensor
          result.cumulativeWheelRevolutions = value.getUint32(
            index,
            /*littleEndian=*/ true
          );
          index += 4;
          result.wheelTimeStamp = value.getUint16(
            index,
            /*littleEndian=*/ true
          );

          result.cumulativeCrankRevolutions = value.getUint16(
            index,
            /*littleEndian=*/ true
          );
          index += 2;
          result.crankTimeStamp = value.getUint16(
            index,
            /*littleEndian=*/ true
          );
          break;

        default:
          // This should never happen
          console.log("Error: Undefined flagfield value: " + flagField);
      }
      return result;
    }

    /* Utils */

    _cacheCharacteristic(service, characteristicUuid) {
      return service
        .getCharacteristic(characteristicUuid)
        .then((characteristic) => {
          this._characteristics.set(characteristicUuid, characteristic);
        });
    }
    _readCharacteristicValue(characteristicUuid) {
      let characteristic = this._characteristics.get(characteristicUuid);
      return characteristic.readValue().then((value) => {
        // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
        value = value.buffer ? value : new DataView(value);
        return value;
      });
    }
    _writeCharacteristicValue(characteristicUuid, value) {
      let characteristic = this._characteristics.get(characteristicUuid);
      return characteristic.writeValue(value);
    }
    _startNotifications(characteristicUuid) {
      let characteristic = this._characteristics.get(characteristicUuid);
      // Returns characteristic to set up characteristicvaluechanged event
      // handlers in the resolved promise.
      return characteristic.startNotifications().then(() => characteristic);
    }
    _stopNotifications(characteristicUuid) {
      let characteristic = this._characteristics.get(characteristicUuid);
      // Returns characteristic to remove characteristicvaluechanged event
      // handlers in the resolved promise.
      return characteristic.stopNotifications().then(() => characteristic);
    }
  }

  window.cadenceSensor = new CadenceSensor();
})();
