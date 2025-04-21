import { NextResponse, type NextRequest } from "next/server";



import Replicate from "replicate";

import * as fal from "@fal-ai/serverless-client";


import { put, PutBlobResult } from '@vercel/blob'


// nextjs-app
export const maxDuration = 60; // This function can run for a maximum of 60 seconds




const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});



export async function POST(request: NextRequest) {


    // array of strings
    // gold, silver, blue, red, green, black, white, yellow, orange, pink, purple, brown, gray, cyan, magenta
    const robotColors = ["gold", "silver", "blue", "red", "green", "black", "white", "yellow", "orange", "pink", "purple", "brown", "gray", "cyan", "magenta"];

    const randomColor = robotColors[Math.floor(Math.random() * robotColors.length)];

    //const englishPrompt = "One cute and " + randomColor + " color metallic robot character with shiny skin in Japanese anime style with a sign AGENT. transparent background.";

    /*
    A fairy (female) who delivers happiness and hope is floating in the air at the center of a gathering of people. She wears a necklace that represents constellations and holds a coin (gold coin) in one hand. Please render it in 3D animation.
    */
    //const englishPrompt = "A fairy (female) who delivers happiness and hope is floating in the air at the center of a gathering of people. She wears a necklace that represents constellations and holds a coin (gold coin) in one hand. Please render it in 3D animation.";


    const englishPrompt = "A high-resolution, ultra-realistic 3D illustration featuring two randomly selected playing cards from a standard 52-card deck, \"[CARD1]\" and \"[CARD2]\", showcased side by side against a clear, transparent background. These unique cards are meticulously designed in a LEGO-inspired style, integrating LEGO minifigures and brick textures into their intricate details. Sharply lit to highlight vibrant colors and complex patterns, they resemble authentic LEGO creations. The illustration boasts a clean, vivid style with a strong emphasis on realism and clarity, perfect for showcasing the cards' LEGO-esque charm. Clean, high-definition photographic style ensures every detail is captured with precision.";


    const negative_prompt = "easynegative,ng_deepnegative_v1_75t,((monochrome)),((grayscale)),bad-picture-chill-75v, (worst quality, low quality:1.4), monochrome, grayscale, sketches, paintings, lowres, normalres, blurry, acnes on face, {{sperm}}, {{bra}}";

    let input = {
        ///seed: 4234234,

        prompt: englishPrompt,

        output_quality: 90,

        //image_size: "square",
        //image_size: "square",
        image_size: "square_hd",

        disable_safety_checker: true,

        negative_prompt: negative_prompt,
    };



    let hosting = "" as any;
    let model = "" as any;

 
    /*
    const randomModel = Math.floor(Math.random() * 5);


  
  

    if (randomModel == 0) {
        hosting = "replicate";
        model = "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f";
    } else if (randomModel == 1) {
        hosting = "replicate";
        model = "datacte/proteus-v0.2:06775cd262843edbde5abab958abdbb65a0a6b58ca301c9fd78fa55c775fc019";
    } else if (randomModel == 2) {
        hosting = "replicate";
        model = "playgroundai/playground-v2.5-1024px-aesthetic:a45f82a1382bed5c7aeb861dac7c7d191b0fdf74d8d57c4a0e6ed7d4d0bf7d24";
    } else {
        hosting = "fal";
        model = "fal-ai/flux/dev";
    }
    */

    //hosting = "fal";
    //model = "fal-ai/flux-realism";

    hosting = "replicate";
    model = "black-forest-labs/flux-dev";


    try {

        //let result = [] as any;

        //let output = [] as any;

        let imageUrl = "";

        if (hosting === "replicate") {

            const output = await replicate.run(model, { input }) as any;
            /*
            output= [
                ReadableStream { locked: false, state: 'readable', supportsBYOB: false }
            ]
            */

            //console.log("output=", output);

            const reader = output[0].getReader();

            // put image to vercel blob storage

            //const filename = "image.png";

            const filename = `image.png`;


            let stream = new ReadableStream({
                start(controller) {
                    function push() {
                        reader.read().then(({ done, value }: { done: boolean; value: Uint8Array }) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            controller.enqueue(value);
                            push();
                        });
                    }
                    push();
                }
            });

            const putBlobResult = await put(filename, stream, {
                contentType: "image/png",
                access: "public",
            });

            imageUrl = putBlobResult.url;

            console.log("imageUrl=", imageUrl);




            /*
            const blob = await new Response(stream).blob();

            imageUrl = URL.createObjectURL(blob);

            console.log("imageUrl=", imageUrl);
            */

            

        } else if (hosting === "fal") {

            const data = await fal.subscribe(model, {

                input: {
                  ///seed: 4072637067,
                  prompt: englishPrompt,
                  num_images: 1,
                  enable_safety_checker: false,
          
                },
                logs: true,
                onQueueUpdate: (update) => {
                  if (update.status === "IN_PROGRESS") {
                    update.logs.map((log) => log.message).forEach(console.log);
                  }
                },
            }) as any;


          
            ////console.log(data);

            
            let result = [] as any;
        
            //const output = data.images[0]?.url;
            // output is array of images
            const output = [
                data?.images[0]?.url,
            ];

            output.forEach((element: any) => {
                result.push({ url: element });
            } );

            imageUrl = result[0].url;

        }

       



        //console.log("result=", result);
        /*
        URL {
            href: 'https://replicate.delivery/yhqm/D2aV5KH1Ma7CH9KY8ZppQcZdbKIc5B43aJxQLmTl7hvJDe2JA/out-0.png',
            origin: 'https://replicate.delivery',
            protocol: 'https:',
            username: '',
            password: '',
            host: 'replicate.delivery',
            hostname: 'replicate.delivery',
            port: '',
            pathname: '/yhqm/D2aV5KH1Ma7CH9KY8ZppQcZdbKIc5B43aJxQLmTl7hvJDe2JA/out-0.png',
            search: '',
            searchParams: URLSearchParams {},
            hash: ''
        }
        */

        // get href from result string

        ///console.log("result=", result.toString());




        

        console.log("imageUrl=", imageUrl);



        return NextResponse.json({

            result: {
                status: "ok",
                imageUrl: imageUrl,
            },
            
        });



    } catch (error) {
        console.log("error=", error);
    }

    return NextResponse.json({
        result: {
            status: "error",
        },
    });

}
