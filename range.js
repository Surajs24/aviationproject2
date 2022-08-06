function Range(Wp, dens, LCV) {
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

  let masslimited = MTOW - OEW - Wp;
  let vollimited = maxfuelvol * 0.003785412 * dens * 2.20462;
  if (masslimited < vollimited) {
    Wf = masslimited;
  } else {
    Wf = vollimited;
  }

  let W1tW0 = 0.97;
  let W2tW1 = 0.985;
  let W4tW3 = Math.exp((-reserve * 60 * SFC) / 3600 / LDr_loiter);
  let W5tW4 = 0.995;
  let W3tW2 =
    (1 - Wf / ((Wf + Wp + OEW) * 1.06)) / (W1tW0 * W2tW1 * W4tW3 * W5tW4);

  let range = ((Vel * LDr_cruise) / (SFC / 3600)) * Math.log(1 / W3tW2);

  range = range * 0.0001645784 * 1.852;

  return range;
}
console.log(Range(138490, 526, 48));
