export async function load({ fetch }) {
    //we want the files
    var response = await fetch("/API/files", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch files');
    }
    const files = await response.json(); // Store the result in a variable
    console.log(files)
	return {
		Files: files,
	};
}


