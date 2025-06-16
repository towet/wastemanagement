# Sensor Bridge: User Guide

This guide provides complete instructions for setting up and running the sensor bridge, which connects your Arduino-based sensor to the web application.

---

### **System Requirements**

Before you begin, ensure you have the following:

1.  **Hardware:**
    *   Arduino Uno (or compatible board)
    *   HC-SR04 Ultrasonic Sensor
    *   HC-05 Bluetooth Module
    *   A PC with Bluetooth capability running Windows.
2.  **Software:**
    *   [Arduino IDE](https://www.arduino.cc/en/software) installed on your PC.
    *   [Node.js](https://nodejs.org/) installed on your PC.

---

### **Key Features**

*   **Real-time Data Sync:** Continuously listens for data from the connected sensor and updates the device status in the database in real-time.
*   **Automatic Notifications:** When a device's fill level exceeds 90%, the bridge automatically sends a "Dustbin Almost Full" notification to **all registered users**.
*   **Robust Connectivity:** Includes automatic reconnection logic to handle serial port disconnections and ensure reliable operation.

---

### **Step 1: Set Up the Arduino Hardware and Software**

First, connect the components and upload the code to your Arduino.

1.  **Wire the Components:**
    *   **HC-SR04 Sensor:** `VCC` to Arduino `5V`, `GND` to Arduino `GND`, `Trig` to Arduino `Pin 9`, `Echo` to Arduino `Pin 10`.
    *   **HC-05 Bluetooth Module:** `VCC` to Arduino `5V`, `GND` to Arduino `GND`, `TXD` to Arduino `RX (Pin 0)`, `RXD` to Arduino `TX (Pin 1)`.

2.  **Upload the Arduino Sketch:**
    *   Disconnect the HC-05 module from the Arduino (this is important for uploading).
    *   Connect the Arduino to your PC with a USB cable.
    *   Open the Arduino IDE, paste the code below into a new sketch, and click **Upload**.

    ```cpp
    // --- Arduino Sketch for HC-SR04 Sensor ---
    const int trigPin = 9;
    const int echoPin = 10;
    const int MAX_HEIGHT_CM = 50; // Defines the height of your container in cm.

    void setup() {
      Serial.begin(9600); // HC-05 default baud rate
      pinMode(trigPin, OUTPUT);
      pinMode(echoPin, INPUT);
    }

    void loop() {
      long duration, distance_cm;
      digitalWrite(trigPin, LOW); delayMicroseconds(2);
      digitalWrite(trigPin, HIGH); delayMicroseconds(10);
      digitalWrite(trigPin, LOW);
      duration = pulseIn(echoPin, HIGH);
      distance_cm = duration * 0.034 / 2;
      int fill_level = 100 - ( (float)distance_cm / MAX_HEIGHT_CM * 100 );
      fill_level = constrain(fill_level, 0, 100);
      Serial.println(fill_level);
      delay(2000); // Wait 2 seconds before the next reading
    }
    ```

3.  **Reconnect Hardware:** After the upload is successful, disconnect the Arduino from the USB and reconnect the HC-05 module.

---

### **Step 2: Find the Bluetooth COM Port on Your PC**

1.  **Pair the HC-05:**
    *   Power on the Arduino. The HC-05's LED should blink rapidly.
    *   On your PC, go to `Settings > Bluetooth & devices > Add device`.
    *   Find the HC-05 module (usually named `HC-05`) and pair with it. The default PIN is usually `1234` or `0000`.

2.  **Find the COM Port:**
    *   Right-click the Start Menu and select **Device Manager**.
    *   Expand the **Ports (COM & LPT)** section.
    *   Look for `Standard Serial over Bluetooth link`. You need the **outgoing** one. Note down the COM port number (e.g., `COM5`).

---

### **Step 3: Configure the System in the Admin Dashboard**

1.  **Log In:** Open the web application and log in with an **admin** account.
2.  **Go to Settings:** In the sidebar menu, click on **Settings**.
3.  **Enter Settings:**
    *   **COM Port:** Enter the COM port number you found in the previous step (e.g., `COM5`).
    *   **Target Device:** Select the specific device that this sensor should update from the dropdown menu.
4.  **Save:** Click the **Save Settings** button.

---

### **Step 4: Run the Sensor Bridge Software**

This is the program that connects the hardware to the website.

1.  **One-Time Setup:**
    *   Open a terminal (PowerShell or Command Prompt) in the project folder.
    *   Navigate to the `bridge` directory:
        ```bash
        cd bridge
        ```
    *   Install the necessary software packages:
        ```bash
        npm install
        ```

2.  **Start the Bridge:**
    *   Make sure you are still in the `bridge` directory in your terminal.
    *   Run the following command:
        ```bash
        npm start
        ```

3.  **Keep it Running:** The terminal will show messages like `Fetching settings...` and `Listening for sensor data...`. **You must keep this terminal window open** for the system to work.

---

### **Step 5: Verify Operation**

1.  **Check the Dashboard:** Go to the user or admin dashboard in the web application. You should see the fill level of the device you configured updating every few seconds.
2.  **Test Notifications:** If the fill level is above 90%, check the notifications page. You should see a new "Dustbin Almost Full" alert.

Congratulations, the system is running!
