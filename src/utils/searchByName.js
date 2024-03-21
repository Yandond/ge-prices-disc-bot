
// Function to search for an object by name in the JSON data
module.exports =  (name) => {
    // Read the JSON data from the file
    const data = require('./mapping.json'); // If 'mapping.json' is in the same directory as your script

    // Search for the object by name
    const result = data.find(item => item.name.toLowerCase().includes(name.toLowerCase()));
    
    return result ? result : null; // Return the found object or null if not found
}
