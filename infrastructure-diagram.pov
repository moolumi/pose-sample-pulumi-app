// POV-Ray file for pose-sample-app/simon stack infrastructure
// Render with: povray +W1920 +H1080 +A0.3 infrastructure-diagram.pov

#version 3.7;

// Camera setup
camera {
    location <-8, 6, -12>
    look_at <0, 0, 0>
    angle 45
}

// Lighting
light_source {
    <-10, 15, -10>
    color rgb <1, 1, 1>
    area_light <2, 0, 0>, <0, 0, 2>, 5, 5
    adaptive 1
    jitter
}

light_source {
    <10, 10, 10>
    color rgb <0.7, 0.7, 0.8>
}

// Background
background { color rgb <0.1, 0.1, 0.2> }

// Ground plane
plane {
    y, -2
    pigment { 
        checker 
        color rgb <0.2, 0.2, 0.3> 
        color rgb <0.15, 0.15, 0.25> 
        scale 2
    }
    finish { ambient 0.3 diffuse 0.7 }
}

// Materials
#declare AWS_Orange = color rgb <1, 0.6, 0.2>;
#declare AWS_Blue = color rgb <0.2, 0.4, 0.8>;
#declare AWS_Green = color rgb <0.2, 0.8, 0.4>;
#declare AWS_Purple = color rgb <0.6, 0.2, 0.8>;
#declare AWS_Red = color rgb <0.8, 0.2, 0.2>;

#declare Metal_Finish = finish {
    ambient 0.2
    diffuse 0.7
    specular 0.8
    roughness 0.01
    reflection 0.3
}

#declare Glass_Finish = finish {
    ambient 0.1
    diffuse 0.3
    specular 0.9
    roughness 0.001
    reflection 0.8
}

// Internet Cloud (user requests)
union {
    sphere { <-6, 4, 0>, 1.2 }
    sphere { <-5, 4.5, 0.5>, 0.8 }
    sphere { <-7, 4.3, -0.3>, 0.9 }
    sphere { <-6.5, 3.5, 0.8>, 0.7 }
    pigment { color rgb <0.9, 0.9, 1> }
    finish { Glass_Finish }
}

text {
    ttf "timrom.ttf" "Internet" 0.1, 0
    pigment { color rgb <0.2, 0.2, 0.8> }
    scale 0.4
    translate <-7.5, 2.5, 0>
}

// API Gateway (main entry point)
box {
    <-1.5, 0, -1>, <1.5, 2, 1>
    pigment { AWS_Orange }
    finish { Metal_Finish }
    translate <0, 0, 0>
}

text {
    ttf "timrom.ttf" "API Gateway" 0.1, 0
    pigment { color rgb <1, 1, 1> }
    scale 0.3
    translate <-1.2, 0.5, 1.1>
}

text {
    ttf "timrom.ttf" "REST API" 0.1, 0
    pigment { color rgb <1, 1, 1> }
    scale 0.25
    translate <-0.8, 0.1, 1.1>
}

// Lambda Function (backend processing)
cylinder {
    <3, 0>, <3, 2.5>, 1
    pigment { AWS_Green }
    finish { Metal_Finish }
    translate <0, 0, 0>
}

text {
    ttf "timrom.ttf" "Lambda" 0.1, 0
    pigment { color rgb <1, 1, 1> }
    scale 0.3
    translate <2.2, 1.8, 1.1>
}

text {
    ttf "timrom.ttf" "handler" 0.1, 0
    pigment { color rgb <1, 1, 1> }
    scale 0.25
    translate <2.3, 1.4, 1.1>
}

text {
    ttf "timrom.ttf" "Node.js 18.x" 0.1, 0
    pigment { color rgb <1, 1, 1> }
    scale 0.2
    translate <2.0, 1.0, 1.1>
}

// S3 Bucket (static content storage)
box {
    <-1, 0, -1>, <1, 1.5, 1>
    pigment { AWS_Blue }
    finish { Metal_Finish }
    translate <-4, 0, 0>
}

text {
    ttf "timrom.ttf" "S3 Bucket" 0.1, 0
    pigment { color rgb <1, 1, 1> }
    scale 0.3
    translate <-5, 1, 1.1>
}

text {
    ttf "timrom.ttf" "Static Content" 0.1, 0
    pigment { color rgb <1, 1, 1> }
    scale 0.2
    translate <-5.2, 0.6, 1.1>
}

text {
    ttf "timrom.ttf" "index.html" 0.1, 0
    pigment { color rgb <1, 1, 1> }
    scale 0.18
    translate <-4.8, 0.3, 1.1>
}

// IAM Role (security/permissions)
sphere {
    <0, 3.5, -3>, 0.8
    pigment { AWS_Purple }
    finish { Metal_Finish }
}

text {
    ttf "timrom.ttf" "IAM Role" 0.1, 0
    pigment { color rgb <1, 1, 1> }
    scale 0.25
    translate <-0.8, 3.8, -2>
}

text {
    ttf "timrom.ttf" "handler-role" 0.1, 0
    pigment { color rgb <1, 1, 1> }
    scale 0.2
    translate <-0.9, 3.4, -2>
}

// Policy attachments (smaller spheres around IAM role)
#declare policy_names = array[7] {
    "CloudWatch", "S3", "Kinesis", "SQS", "Cognito", "XRay", "Events"
}

#declare policy_positions = array[7] {
    <-1.2, 4.2, -3.5>, <1.2, 4.2, -3.5>, <-1.5, 3.5, -2.2>, 
    <1.5, 3.5, -2.2>, <-1.2, 2.8, -3.5>, <1.2, 2.8, -3.5>, <0, 4.5, -2.5>
}

#local i = 0;
#while (i < 7)
    sphere {
        policy_positions[i], 0.3
        pigment { AWS_Red }
        finish { Metal_Finish }
    }
    
    text {
        ttf "timrom.ttf" policy_names[i] 0.05, 0
        pigment { color rgb <1, 1, 1> }
        scale 0.15
        translate policy_positions[i] + <-0.3, -0.5, 0.4>
    }
    
    #local i = i + 1;
#end

// Connection arrows/lines
// Internet to API Gateway
cylinder {
    <-4.5, 4, 0>, <-1.5, 2, 0>, 0.05
    pigment { color rgb <0.8, 0.8, 0.8> }
    finish { Metal_Finish }
}

// API Gateway to Lambda
cylinder {
    <1.5, 1, 0>, <2, 1.5, 0>, 0.05
    pigment { color rgb <0.8, 0.8, 0.8> }
    finish { Metal_Finish }
}

// API Gateway to S3
cylinder {
    <-1.5, 1, 0>, <-3, 1, 0>, 0.05
    pigment { color rgb <0.8, 0.8, 0.8> }
    finish { Metal_Finish }
}

// IAM Role to Lambda (permission flow)
cylinder {
    <0, 2.7, -3>, <3, 2.5, 0>, 0.03
    pigment { color rgb <0.6, 0.2, 0.8> }
    finish { Metal_Finish }
}

// Stack information
text {
    ttf "timrom.ttf" "pose-sample-app/simon Stack" 0.1, 0
    pigment { color rgb <1, 1, 0.8> }
    scale 0.5
    translate <-3, -1, 3>
}

text {
    ttf "timrom.ttf" "AWS Region: us-west-2" 0.1, 0
    pigment { color rgb <0.8, 0.8, 1> }
    scale 0.3
    translate <-2.5, -1.5, 3>
}

text {
    ttf "timrom.ttf" "Serverless Web Application" 0.1, 0
    pigment { color rgb <0.8, 1, 0.8> }
    scale 0.35
    translate <-3.2, -0.5, 3>
}

// Request flow indicators
text {
    ttf "timrom.ttf" "HTTP Requests" 0.1, 0
    pigment { color rgb <1, 1, 0.5> }
    scale 0.2
    rotate <0, 15, 0>
    translate <-3.5, 3, 0.5>
}

text {
    ttf "timrom.ttf" "/source -> Lambda" 0.1, 0
    pigment { color rgb <0.5, 1, 0.5> }
    scale 0.18
    rotate <0, -10, 0>
    translate <0.5, 2.2, 0.5>
}

text {
    ttf "timrom.ttf" "/ -> S3 Static" 0.1, 0
    pigment { color rgb <0.5, 0.8, 1> }
    scale 0.18
    rotate <0, 10, 0>
    translate <-2.8, 1.8, 0.5>
}

// Architecture pattern label
text {
    ttf "timrom.ttf" "Serverless Architecture Pattern:" 0.1, 0
    pigment { color rgb <1, 0.8, 0.2> }
    scale 0.25
    translate <-6, 6, -2>
}

text {
    ttf "timrom.ttf" "API Gateway + Lambda + S3" 0.1, 0
    pigment { color rgb <1, 0.8, 0.2> }
    scale 0.22
    translate <-5.5, 5.6, -2>
}