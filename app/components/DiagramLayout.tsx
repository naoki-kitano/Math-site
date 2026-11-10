"use client";
import {createContext} from "react";

// Only the current example uses the compact drawing canvas. Mathematical
// coordinates and equal axis scale remain the diagram renderer's responsibility.
export const DiagramLayoutContext=createContext(false);
