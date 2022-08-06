Sub test()
    Wp = 123000
    den = 800
    CV = 42
    result = Range(Wp, den, CV)
End Sub



Function Range(Wp, dens, LCV) As Double

'Aircraft data for Boeing 747
MTOW = 823000           'Maximum take off weight (lb)
OEW = 388010            'Operating Empty weight (lb)
maxpayload = 138490     'Maxium payload (lb)
maxfuelvol = 54387.595  'Maximum fuel tank volume (USgal)
LDr_cruise = 17.5       'Lift to Drag Ratio during cruise
LDr_loiter = 17.5       'Lift to Drag Ratio during loitering
a = 972.885             'Speed of sound at cruise altitude (ft/s)
SFC = 0.617             '(1/hr)

'Flight schedule
'1 - take off
'2 - climb
'3 - cruise at 35000ft at
mach = 0.85            'Cruise mach number
'4 - circle / reserve for
reserve = 45           'mins
'5 - land

Vel = a * mach 'cruise flight speed (ft/s)

'baseline fuel
bdens = 790            'density (kg/m^3)
bLCV = 43.2            'calorific value (MJ/kg)
bSFC = 0.617           'baseline specific fuel consumption

SFC = bSFC * bLCV / LCV 'specific fuel consumption
    
masslimited = MTOW - OEW - Wp
vollimited = maxfuelvol * 0.003785412 * dens * 2.20462
If masslimited < vollimited Then
    Wf = masslimited
Else
    Wf = vollimited
End If
   
W1tW0 = 0.97
W2tW1 = 0.985
W4tW3 = Exp((-reserve * 60 * SFC / 3600) / LDr_loiter)
W5tW4 = 0.995
W3tW2 = (1 - (Wf / ((Wf + Wp + OEW) * 1.06))) / (W1tW0 * W2tW1 * W4tW3 * W5tW4)

    Range = (Vel * LDr_cruise / (SFC / 3600)) * Log(1 / W3tW2)
   
    
    Range = Range * 0.0001645784 * 1.852
End Function

Function Fuelmass(Wpay, Range, dens, LCV) As Double

'Aircraft data for Boeing 747
MTOW = 823000           'Maximum take off weight (lb)
OEW = 388010            'Operating Empty weight (lb)
maxpayload = 138490     'Maxium payload (lb)
maxfuelvol = 54387.595  'Maximum fuel tank volume (USgal)
LDr_cruise = 17.5       'Lift to Drag Ratio during cruise
LDr_loiter = 17.5       'Lift to Drag Ratio during loitering
a = 972.885             'Speed of sound at cruise altitude (ft/s)
SFC = 0.617             '(1/hr)

'Flight schedule
'1 - take off
'2 - climb
'3 - cruise at 35000ft at
mach = 0.85            'Cruise mach number
'4 - circle / reserve for
reserve = 45           'mins
'5 - land

Vel = a * mach 'cruise flight speed (ft/s)

'baseline fuel
bdens = 790            'density (kg/m^3)
bLCV = 43.2            'calorific value (MJ/kg)
bSFC = 0.617           'baseline specific fuel consumption

SFC = bSFC * bLCV / LCV 'specific fuel consumption
    
'convert to imperial units
Wpay = Wpay * 2.20462
Range = Range / (0.0001645784 * 1.852)

'weight ratios
W1tW0 = 0.97
W2tW1 = 0.985
W4tW3 = Exp((-reserve * 60 * SFC / 3600) / LDr_loiter)
W5tW4 = 0.995
W3tW2 = 1 / Exp((Range * SFC / 3600) / (Vel * LDr_cruise))

Wf = 200000
Wf_new = 0
Wf_old = Wf

Fixed = (1 - (W3tW2 * (W1tW0 * W2tW1 * W4tW3 * W5tW4))) / (1 / 1.06)

n = 0
'itterate to find Wf (using Newton Raphson technique)
Do While Sqr((Wf_new - Wf_old) ^ 2) > 50
    vari = Wf / ((Wf + Wpay + OEW))
    der = (Wpay + OEW) / ((Wf + Wpay + OEW) ^ 2)
       
    Wf_old = Wf
    Wf_new = Wf - (vari - Fixed) / der
    Wf = Wf_new
    n = n + 1
Loop

'comparison of Wf old and Wf
masslimited = MTOW - OEW - Wpay
vollimited = maxfuelvol * 0.003785412 * dens * 2.20462


If Wf > masslimited Then
    limits = 1
ElseIf Wf > vollimited Then
    limits = 2
Else

    limits = 0
End If


    'switch units to metric
    Fuelmass = Round(Wf * 0.4535924)


End Function
