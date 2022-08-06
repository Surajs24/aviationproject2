function Fuelmass(Wpay, Range, dens, LCV) {
  //Aircraft data for Boeing 747
  let MTOW = 823000; //Maximum take off weight (lb)
  let OEW = 388010; //Operating Empty weight (lb)
  let maxpayload = 138490; //Maxium payload (lb)
  let maxfuelvol = 54387.595; //Maximum fuel tank volume (USgal)
  let LDr_cruise = 17.5; //Lift to Drag Ratio during cruise
  let LDr_loiter = 17.5; //Lift to Drag Ratio during loitering
  let a = 972.885; //Speed of sound at cruise altitude (ft/s)
  let SFCX = 0.617; //(1/hr)

  //Flight schedule
  //1 - take off
  //2 - climb
  //3 - cruise at 35000ft at
  let mach = 0.85; //Cruise mach number
  //4 - circle / reserve for
  let reserve = 45; //mins
  //5 - land

  let Vel = a * mach; //cruise flight speed (ft/s)

  //baseline fuel
  let bdens = 790; //density (kg/m^3)
  let bLCV = 43.2; //calorific value (MJ/kg)
  let bSFC = 0.617; //baseline specific fuel consumption

  let SFC = (bSFC * bLCV) / LCV; //specific fuel consumption

  //convert to imperial units
  Wpay = Wpay * 2.20462;
  Range = Range / (0.0001645784 * 1.852);

  //weight ratios
  let W1tW0 = 0.97;
  let W2tW1 = 0.985;
  let W4tW3 = Math.exp((-reserve * 60 * SFC) / 3600 / LDr_loiter);
  let W5tW4 = 0.995;
  let W3tW2 = 1 / Math.exp((Range * SFC) / 3600 / (Vel * LDr_cruise));

  let Wf = 200000;
  let Wf_new = 0;
  let Wf_old = Wf;

  let Fixed = (1 - W3tW2 * (W1tW0 * W2tW1 * W4tW3 * W5tW4)) / (1 / 1.06);

  n = 0;
  //itterate to find Wf (using Newton Raphson technique)
  do {
    vari = Wf / (Wf + Wpay + OEW);
    der = (Wpay + OEW) / Math.pow(Wf + Wpay + OEW, 2);

    Wf_old = Wf;
    Wf_new = Wf - (vari - Fixed) / der;
    Wf = Wf_new;
    n = n + 1;
  } while (Math.sqrt(Math.pow(Wf_new - Wf_old, 2)) > 50);

  //comparison of Wf old and Wf
  let masslimited = MTOW - OEW - Wpay;
  let vollimited = maxfuelvol * 0.003785412 * dens * 2.20462;

  if (Wf > masslimited) {
    limits = 1;
  } else if (Wf > vollimited) {
    limits = 2;
  } else {
    limits = 0;
  }

  //switch units to metric
  fuelmass = Math.round(Wf * 0.4535924);
  return fuelmass;
}
console.log(Fuelmass(50000, 8000, 769, 41));
