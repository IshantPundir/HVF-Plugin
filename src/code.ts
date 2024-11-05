import { node_to_svg, d_to_ring, normalize } from "./hvf";

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(400, 600)


figma.ui.onmessage =  async(msg: {type: string, group_name: string, frames: string[],  width: number, height: number, maxSegmentLength:number}) => {
  if (msg.type === 'create-frames') {
    // Creates rectangles on the screen.
    const width = msg.width;
    const height = msg.height;
    const group_name = msg.group_name;

    const nodes: SceneNode[] = [];
    
    // Loop to create the specified number of rectangles.
    for (let i = 0; i < msg.frames.length; i++) {
      const frame = figma.createFrame();
      frame.resize(width, height); // Set the size of each rectangle.
      frame.name = msg.frames[i];

      // Calculate the x and y positions based on the index to wrap every 5 rectangles.
      const row = Math.floor(i / 5); // Determine the row (every 5 rectangles creates a new row).
      const col = i % 5; // Determine the column within the row.

      frame.x = col * (width + 10); // Place rectangles in columns with a 10px gap.
      frame.y = row * (height + 10); // Place rectangles in rows with a 10px gap.

      frame.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]; // Fill rectangles with black.

      // Add the rectangle to the current Figma page.
      figma.currentPage.appendChild(frame);
      nodes.push(frame); // Store each rectangle in the nodes array.
    }

    // Group all created rectangles together and name the group.
    const group = figma.group(nodes, figma.currentPage);
    group.name = group_name; // Set the desired name for the group.

    // Select the newly created group and zoom into view.
    figma.currentPage.selection = [group];
    figma.viewport.scrollAndZoomIntoView([group]);
  }

  else if (msg.type == 'export') {
    // Export selected frames or group of frames as an .hvf file.
    var output: { [group: string]: { [id: string]: Number[][][] } } = {};

    // Select all frames!
    let frames = figma.currentPage.findAll(n=>{
      if (n.type === 'FRAME') return true
      return false
    });

    for (let i=0; i < frames.length; i++) {
      let frame = frames[i];
      let id = frame.name;
      let group = frame.parent?.name;
      if (group == undefined) { group = ""; }

      // Convert frame node to svg path;
      await node_to_svg(frame).then(svg =>  {
        const d:String[] = [];
        const ring :any[]= [];

        // Extract path 'd' from svg;
        svg['children'][0].children.forEach((child: { tagName: string; properties: { d: string } }) => {
          if (child['tagName'] === 'path') {
            d.push(child['properties']['d'])
          }
        });

        // Convert d to ring.
        d.forEach(_d => {
          let _ring:Number[][] = d_to_ring(_d, msg.maxSegmentLength);
          _ring = normalize(_ring);
          ring.push(_ring);
        });

        // Add ring with group and id to output directory.
        if (!output[group]) {
          output[group] = {};
        }

        output[group][id] = ring;
        console.log("Group:", group, "id:", id, "ring:", ring);
      });
    }

    // save the values to output['group-id']['viseme-id]
    figma.notify("Exporting design as HVF file...");

    figma.ui.postMessage({
      type: "download_hvf",
      hvf_collection: output,
      filename: "output.json"
    });
  }

  else if (msg.type == 'cancel') {
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
  }
};

