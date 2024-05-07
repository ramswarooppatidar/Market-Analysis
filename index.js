let chart = null;
let singleCom = null;
let summary = "";

getStockDetail();
fetch("https://stocks3.onrender.com/api/stocks/getstocksdata")
 .then((response)=>{
     if(!response.ok){
         throw new Error(" any")
     }
     return response.json();
 })
 .then((data)=>{
     
     const stocksData = data.stocksData;
     const company = stocksData[0];
      singleCom = company.AMZN;
     const oneMonth = singleCom['1mo'];
    const timeStamp = oneMonth['timeStamp']
    const value = oneMonth['value']

    updateChart(timeStamp, value, singleCom);  

     //FETch 10 button
     const comButtons = document.querySelectorAll(".row button");
     comButtons.forEach(comBtn=>{
        comBtn.addEventListener('click', function(event){
            const companyName = event.target.textContent;
            singleCom = company[companyName]
            console.log("inside fetch 10 button comName", companyName)
            const oneMonth = singleCom['1mo'];
            const timeStamp = oneMonth['timeStamp']
            const value = oneMonth['value']
        
            updateChart(timeStamp, value, singleCom);  
            getStockDetail(companyName);
            getStockProfile(companyName)

            // Trigger click event on the "1 month" button
        const oneMonthButton = document.querySelector(".timeBtn[name='1mo']");
        oneMonthButton.click();
        })
     })
     console.log("this console not print ",singleCom)
    
     //chart button
     const timeButtons = document.querySelectorAll(".timeBtn");
     timeButtons.forEach(timeButton => {
        timeButton.addEventListener("click",function(event){
        
        // Remove active class from all buttons
        timeButtons.forEach(btn => btn.classList.remove("active"));

        const buttonName = event.target.getAttribute('name');
        console.log("button name ", buttonName);
            const monYear = singleCom[`${buttonName}`];
            const timeStamp = monYear['timeStamp']
            const value = monYear['value']
        
        
        // Set the clicked button as active
        event.target.classList.add("active");

            if (chart !== null) {
                console.log("not a null")
                chart.destroy();
            }

            updateChart(timeStamp, value, singleCom);      
     })
 });
    
 })
 .catch((err)=>{
     console.log(err);
 })



 function drawGraph(timeStmp, value, company) {
     const graphEl = document.querySelector("#incomeChart");
     const ctx = graphEl.getContext("2d");
 
     // Create the chart
      chart = new Chart(ctx, {
         type: 'line',
         data: {
             labels: timeStmp,
             datasets: [{
                 label: company,
                 data: value,
                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
                 borderColor: 'rgba(255, 99, 132, 1)',
                 borderWidth: 2
             }]
         },
         options: {
             scales: {
                 yAxes: [{
                     ticks: {
                         beginAtZero: true
                     }
                 }]
             },
             
         }
     });
 }
 function updateChart(timeStmp, value, company) {
    // If there's an existing chart instance, destroy it
    if (chart) {
        chart.destroy();
    }

    // Draw the new chart
    drawGraph(timeStmp, value, company);
}
//fetch  summary about stock
function getStockDetail(compName="AAPL"){
    console.log("argument vale :",compName)
    fetch("https://stocks3.onrender.com/api/stocks/getstocksprofiledata")
 .then((response)=>{
    if(!response.ok){
        throw new Error(" any")
    }
    return response.json();
})
.then((data)=>{
    console.log("msgg", data)
    const stockProfile = data['stocksProfileData'];
    const stockDetail = stockProfile[0];
    // console.log(stockDetail);
    // console.log("stockDetail.AMZN",stockDetail[compName])
    const para = document.querySelector(".para");

    para.textContent = `${compName}: ${stockDetail[compName]['summary']}`;
 
})
}
//create button dynamically
fetch('https://stocks3.onrender.com/api/stocks/getstockstatsdata')
    .then((response) => {
        if (!response.ok) {
            return new Error("Data is not available");
        }
        return response.json();
    })
    .then( /*async*/(data) => {
        const stockData = data['stocksStatsData'];
        const eachData = stockData[0];
        console.log("Each data ", eachData);

        for (const ele in eachData) {
            if (ele == '_id') {
                continue;
            }
            console.log(ele);
            const companyEl = document.querySelector(".company");

            const row = document.createElement('div');
            row.classList.add("row");

            const btnEl = document.createElement('button');
            btnEl.textContent = ele;

            const priceDiv = document.createElement('div');
            const priceEl = document.createElement('span');
            priceEl.classList.add("price");
            const priceH4 = document.createElement('h4');
            // Convert price to 2 decimal places
            priceH4.textContent = `$: ${Number(eachData[ele]['bookValue']).toFixed(2)}`;
            priceEl.appendChild(priceH4);
            priceDiv.appendChild(priceEl);

            const profitDiv = document.createElement('div');
            const profitEl = document.createElement('span');
            profitEl.classList.add("profit");
            const profitH4 = document.createElement('h4');
            // Convert profit to 2 decimal places
            profitH4.textContent =`${Number(eachData[ele]['profit']).toFixed(2)} %`;
            profitEl.appendChild(profitH4);
            profitDiv.appendChild(profitEl);

            row.appendChild(btnEl);
            row.appendChild(priceEl);
            row.appendChild(profitEl);

            companyEl.appendChild(row);

            // Wait for 1 second before proceeding to the next iteration
           // await new Promise(resolve => setTimeout(resolve, 50));
        }
    })
    .catch((error) => {
        console.error("Error fetching stock data:", error);
    });

    //fetch stock stats
    function getStockProfile(company="AAPL"){
        console.log("getStockProfile  copnayName,",company)
        fetch("https://stocks3.onrender.com/api/stocks/getstockstatsdata")
    .then((response)=>{
        if(!response.ok){
            return new Error("unaible to fetch data ")
        }
        return response.json();
    })
    .then((data)=>{
        const stockData = data['stocksStatsData'];
        const eachData = stockData[0];
        console.log("Each data ", eachData[company]);
        const stocProfileEl = document.getElementsByClassName("stock-profile");

        const stockNameEl = document.getElementsByClassName("stockName")[0];
        const stockPriceEl = document.getElementsByClassName("stockPrice")[0];
        const stockProfitEl = document.getElementsByClassName("stockProfit")[0];
        stockNameEl.textContent = company;
        stockPriceEl.textContent =  `$:${eachData[company]['bookValue']}`
        stockProfitEl.textContent = `$:${eachData[company]['profit']}`

        stocProfileEl.appendChild(stockNameEl);
        stocProfileEl.appendChild(stockProfitEl);
        stocProfileEl.appendChild(stockPriceEl);
            
    })

    }
    

