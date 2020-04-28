const urlForm = document.querySelector('form')

urlForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const orgUrl = document.getElementById('input_url').value
    const url = '/new?orgUrl=' + orgUrl

    fetch(url, {
            method: 'POST'
        })
        .then(res => res.json()) // expecting a json response
        .then(data => {
            if (data.error) return document.getElementById('a_link').innerHTML = "Error! Couldn't generate URL"
            document.getElementById('a_link').innerHTML = data.newUrl
            document.getElementById('a_link').href = data.newUrl
            document.getElementById('div_link').style.visibility = "visible"
        });

    document.getElementById("input_url").blur
})