export async function load({ fetch, data }) {
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
    

    response = await fetch("/API/Tags", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch files');
    }
    const Tags = await response.json();
    console.log(Tags)

    response = await fetch("/API/subjects", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch subjects');
    }
    const Subjects = await response.json();
    console.log(Subjects.logs)
    console.log("hello guys")
    console.log("User Role: "+data.role)
	return {
		Files: files,
        Tags: Tags,
        Subjects: Subjects.logs,
        role: data.role
	};
}


