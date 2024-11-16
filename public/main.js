document.addEventListener('DOMContentLoaded', () => {

    const studentBtn = document.getElementById('studentBtn');
    const teacherBtn = document.getElementById('teacherBtn');
    const pinForm = document.getElementById('pinForm');
    const studentForm = document.getElementById('studentForm');
    const teacherActions = document.getElementById('teacherActions');
    const closeStudentForm = document.getElementById('closeStudentForm');
    const heading1 = document.getElementById('first');
    const heading2 = document.getElementById('second');
    const opt=document.getElementById('opt');

    // Define the unique 4-digit teacher PIN
    const teacherPIN = '1234';

    // Search functionality
    const resetSearch = () => {
        document.getElementById('searchResults').innerHTML = '';
        document.getElementById('searchResultContainer').style.display = 'none';
    };

    // Event listener for student button
    studentBtn.addEventListener('click', () => {
        studentForm.style.display = 'flex'; // Show student registration form
        pinForm.style.display = 'none'; // Hide teacher PIN input
        teacherActions.style.display = 'none'; // Hide teacher functionalities
        studentBtn.style.display = 'none'; // Hide student button
        teacherBtn.style.display = 'none'; // Hide teacher button
        closeStudentForm.style.display = 'block';
        closeStudentForm.setAttribute('data-role', 'student'); // Add a data attribute to track the form type
        heading1.style.display = 'none';
        heading2.style.display = 'block';
        document.getElementById('student icon').style.display = 'none';
        document.getElementById('teacher icon').style.display = 'none';
    });

    // Event listener for teacher button
    teacherBtn.addEventListener('click', () => {
        pinForm.style.display = 'flex'; // Show teacher PIN input
        studentForm.style.display = 'none'; // Hide student registration form
        teacherActions.style.display = 'none'; // Hide teacher functionalities
        studentBtn.style.display = 'none'; // Hide student button
        teacherBtn.style.display = 'none'; // Hide teacher button
        closeStudentForm.style.display = 'block';
        closeStudentForm.setAttribute('data-role', 'teacher'); // Add a data attribute to track the form type
        heading1.style.display = 'none';
        heading2.style.display = 'block';
        document.getElementById('student icon').style.display = 'none';
        document.getElementById('teacher icon').style.display = 'none';

        resetSearch();
    });
    pinForm.addEventListener('keypress',  function(event){
        if (event.key === 'Enter') {
            event.preventDefault();
            const enteredPIN = document.getElementById('pinInput').value;
            if (enteredPIN === teacherPIN) {
                teacherActions.style.display = 'block'; // Show teacher functionalities
                pinForm.style.display = 'none'; // Hide PIN form
                studentForm.style.display = 'none'; // Hide student registration form
            } else {
                alert('Incorrect PIN. Access denied.');
            }
            document.getElementById('pinInput').value = ''; // Clear input field
        }
        
    });
    // Event listener for PIN submission
    document.getElementById('submitPinBtn').addEventListener('click', () => {
        const enteredPIN = document.getElementById('pinInput').value;
        if (enteredPIN === teacherPIN) {
            teacherActions.style.display = 'block'; // Show teacher functionalities
            pinForm.style.display = 'none'; // Hide PIN form
            studentForm.style.display = 'none'; // Hide student registration form
        } else {
            alert('Incorrect PIN. Access denied.');
        }
        document.getElementById('pinInput').value = ''; // Clear input field
    });

    // Add student functionality
    document.getElementById('addStudentBtn').addEventListener('click', function () {
        studentForm.style.display = 'flex';
        document.getElementById('searchForm').style.display = 'none';
        resetSearch();
    });

    // Search student functionality
    document.getElementById('searchStudentBtn').addEventListener('click', function () {
        document.getElementById('searchForm').style.display = 'flex';
        studentForm.style.display = 'none';
        resetSearch();
    });

    studentForm.addEventListener('keypress',  async function(event) {
        // Check if the Enter key was pressed
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default form submission
          const name = document.getElementById('name').value;
        const admission_number = document.getElementById('rollno').value;
        const section = document.getElementById('section').value;
        const gmail = document.getElementById('gmail').value;
        const photoInput = document.getElementById('photo'); // Image input
        const photoFile = photoInput.files[0]; // Get the file

        const formData = new FormData(); // Create FormData object to send both text and image data
        formData.append('name', name);
        formData.append('rollno', admission_number);
        formData.append('section', section);
        formData.append('gmail', gmail);
        formData.append('photo', photoFile); // Append photo file

        try {
            // Sending a POST request to register the student with image
            const response = await fetch('/registerStudent', {
                method: 'POST',
                body: formData, // Send form data
            });

            const data = await response.json(); // Parse the JSON response once

            if (response.ok) {
                // If successful, update the student list
                const studentList = document.getElementById('studentList');
                const newStudent = document.createElement('li');

                // Create image element for student photo
                const img = document.createElement('img');
                img.src = data.student.photo; // Assuming server responds with URL
                img.style.width = '50px';
                img.style.height = '50px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
                img.style.marginRight = '20px';
                newStudent.appendChild(img); // Append image to the student list item

                newStudent.textContent = `${data.student.name} (Roll No: ${data.student.rollno}, Section: ${data.student.section}), Gmail: ${data.student.gmail}`;

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'X';
                deleteBtn.addEventListener('click', function () {
                    studentList.removeChild(newStudent);
                });

                newStudent.appendChild(deleteBtn);
                studentList.appendChild(newStudent);
                alert(data.message); // Show success message
            } else {
                alert('Failed to register student: ' + data.message); // Provide feedback on failure
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error registering student'); // Alert on catch error
        }

        studentForm.reset();          // Programmatically submit the form
        }
      });

    // Handle student registration and image upload
    studentForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent page refresh
        const name = document.getElementById('name').value;
        const admission_number = document.getElementById('rollno').value;
        const section = document.getElementById('section').value;
        const gmail = document.getElementById('gmail').value;
        const photoInput = document.getElementById('photo'); // Image input
        const photoFile = photoInput.files[0]; // Get the file

        const formData = new FormData(); // Create FormData object to send both text and image data
        formData.append('name', name);
        formData.append('rollno', admission_number);
        formData.append('section', section);
        formData.append('gmail', gmail);
        formData.append('photo', photoFile); // Append photo file

        try {
            // Sending a POST request to register the student with image
            const response = await fetch('/registerStudent', {
                method: 'POST',
                body: formData, // Send form data
            });

            const data = await response.json(); // Parse the JSON response once

            if (response.ok) {
                // If successful, update the student list
                const studentList = document.getElementById('studentList');
                const newStudent = document.createElement('li');

                // Create image element for student photo
                const img = document.createElement('img');
                img.src = data.student.photo; // Assuming server responds with URL
                img.style.width = '50px';
                img.style.height = '50px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
                img.style.marginRight = '20px';
                newStudent.appendChild(img); // Append image to the student list item

                newStudent.textContent = `${data.student.name} (Roll No: ${data.student.rollno}, Section: ${data.student.section}), Gmail: ${data.student.gmail}`;

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'X';
                deleteBtn.addEventListener('click', function () {
                    studentList.removeChild(newStudent);
                });

                newStudent.appendChild(deleteBtn);
                studentList.appendChild(newStudent);
                alert(data.message); // Show success message
            } else {
                alert('Failed to register student: ' + data.message); // Provide feedback on failure
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error registering student'); // Alert on catch error
        }

        studentForm.reset(); // Clear the form
    });

    // Event listener for search button
    document.getElementById('searchButton').addEventListener('click', async function () {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    try {
        // Fetch the search results and append a timestamp to avoid caching issues
        const response = await fetch(`/searchStudents?name=${encodeURIComponent(searchTerm)}&timestamp=${new Date().getTime()}`);

        const results = await response.json();

        // Check if results contain an error field
        if (results.error) {
            throw new Error(results.error); // Throws an error with the message from the server
        }

        const searchResults = document.getElementById('studentList');
        searchResults.innerHTML = ''; // Clear previous results

        if (results.length > 0) {
            results.forEach(student => {
                const li = document.createElement('li');
                li.style.display = 'flex'; // Flexbox to align image and text
                li.style.alignItems = 'center'; // Align vertically

                // Create image element for student photo
                const img = document.createElement('img');
                
                // Assuming the photo field in the database contains the file name
                img.src = `${student.photo}`; // Get photo path from the result
                img.alt = `Photo of ${student.name}`;
                img.style.width = '50px';
                img.style.height = '50px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
                img.style.marginRight = '20px';

                // Add image to list item
                li.appendChild(img);

                // Create a text node for student information
                const textNode = document.createTextNode(`${student.name} (Roll No: ${student.rollno}, Section: ${student.section}, Gmail: ${student.gmail})`);
                li.appendChild(textNode);
                
                // Create the "X" button to remove the student
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'X';
                deleteBtn.style.marginLeft = '10px';
                deleteBtn.addEventListener('click', function () {
                    searchResults.removeChild(li); // Remove the student from the list
                });

                li.appendChild(deleteBtn); // Append the "X" button to the list item
                searchResults.appendChild(li);

                // Append the list item to the results
                searchResults.appendChild(li);
            });

            document.getElementById('studentListContainer').style.display = 'block'; // Show search results container
        } else {
            // Show no results only if there are no results found
            document.getElementById('studentListContainer').style.display = 'none'; // Hide search results container
            alert('No results found.'); // Alert only when no results are found
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error searching students: ' + error.message);
    }
});

   // Toggle student list visibility and fetch student data
    document.getElementById('toggleStudentListBtn').addEventListener('click', async function () {
        const studentListContainer = document.getElementById('studentListContainer');
        const studentList = document.getElementById('studentList');
        studentList.innerHTML = ''; // Clear previous results

        if (studentListContainer.style.display === 'none') {
            try {
                const response = await fetch('/students'); // Fetch all students
                const students = await response.json();

                // Check if students were retrieved successfully
                if (students.length > 0) {
                    students.forEach(student => {
                        console.log(student);
                        const li = document.createElement('li');
                        
                        // Create image element for student photo
                        const img = document.createElement('img');
                        
                        // Assuming the photo field in the database contains the file name
                        img.src = student.photo; // Get photo path from the result
                        img.alt = `Photo of ${student.name}`;
                        img.style.width = '50px';
                        img.style.height = '50px';
                        img.style.objectFit = 'cover';
                        img.style.borderRadius = '50%';
                        img.style.marginRight = '20px';

                        // Add image to list item
                        li.appendChild(img);

                        li.textContent = `${student.name} (Roll No: ${student.rollno}, Section: ${student.section}, Gmail: ${student.gmail})`;
                        studentList.appendChild(li);
                    });
                } else {
                    studentList.innerHTML = '<li>No students found.</li>';
                }

                studentListContainer.style.display = 'block'; // Show student list
            } catch (error) {
                console.error('Error:', error);
                alert('Error fetching student list.');
            }
        } else {
            studentListContainer.style.display = 'none'; // Hide student list
        }
    });


closeStudentForm.addEventListener('click', () => {
    const role = closeStudentForm.getAttribute('data-role');
    
    if (role === 'student') {
        studentForm.style.display = 'none'; // Hide student form
        studentBtn.style.display = 'block'; // Show student button
        teacherBtn.style.display = 'block'; // Show teacher button
        heading1.style.display = 'block'; // Show original heading
        heading2.style.display = 'none'; // Hide secondary heading
        document.getElementById('student icon').style.display = 'block';
        document.getElementById('teacher icon').style.display = 'block';
    } else if (role === 'teacher') {
        pinForm.style.display = 'none'; // Hide teacher PIN form
        studentBtn.style.display = 'inline-block'; // Show student button
        teacherBtn.style.display = 'inline-block'; // Show teacher button
        heading1.style.display = 'block'; // Show original heading
        heading2.style.display = 'none'; // Hide secondary heading
        document.getElementById('student icon').style.display = 'block';
        document.getElementById('teacher icon').style.display = 'block';
        teacherActions.style.display='none';
    }
    else{
        
        document.getElementById('student icon').style.display = 'block';
        document.getElementById('teacher icon').style.display = 'block';
        heading1.style.display = 'block'; // Show original heading
        heading2.style.display = 'none'; // Hide secondary heading
        teacherActions.style.display='none';
        
    }
    
    closeStudentForm.style.display = 'none'; // Hide the close button
});


});

