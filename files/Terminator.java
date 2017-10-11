package org.lejos.example;

import lejos.nxt.*;
import lejos.robotics.navigation.DifferentialPilot;

/**
 * Example leJOS Project with an ant build file
 *
 */
public class HelloWorld {

    static DifferentialPilot pilot = new DifferentialPilot(5.6, 17.5f, Motor.A, Motor.B);
    static UltrasonicSensor ultra = new UltrasonicSensor(SensorPort.S2);
    static LightSensor light = new LightSensor(SensorPort.S1);

    public static void main(String[] args) {

        System.out.println("I'll be back!");
        Button.waitForAnyPress();
        
    }
    
}
