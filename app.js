//Storage Control
const StorageCtrl = (function(){
  // Public methods
  return {
    storeItem: function(item){
      let items;
      // Check if any items in ls
      if(localStorage.getItem('items') === null){
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is already in ls
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item
        items.push(item);

        // Re set ls
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(id, before, after, time){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item){
        if(id === item.id){
          switch(time){
            case 0:               				
				item.morn_before = before;
				item.morn_after = after;
				break;
            case 1:
				item.aft_before = before;
				item.aft_after = after;
				break;
            case 2:
				item.nig_before = before;
				item.nig_after = after;
				break;
        };
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
	/*
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));
      
      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },*/
    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();

//Item Control
const ItemCtrl = (function(){

    //Constructor
    const Item = function(id, before, after, date_id, f_date, time){
        this.id = id;
        this.date_id = date_id;
        this.f_date = f_date;
		this.time = time;
        switch(time){
            case 0:
            
                this.morn_before = before;
                this.morn_after = after;
				this.aft_before = '';
                this.aft_after = '';
				this.nig_before = '';
                this.nig_after = '';
            
            break;
            case 1:
				this.morn_before = '';
                this.morn_after = '';
                this.aft_before = before;
                this.aft_after = after;
				this.nig_before = '';
                this.nig_after = '';
         
            break;
            case 2:
				this.morn_before = '';
                this.morn_after = '';
				this.aft_before = '';
                this.aft_after = '';
                this.nig_before = before;
                this.nig_after = after;
          
            break;
        };
        //console.log('constructor ...');
    }

    //Data
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentDateID: null,
        currentDate: null,
        currentTime: null,
        currentItem: null,
		currentBefore: null,
		currentAfter: null,
        avgLastMonth: null,
        avgLastWeek: null,
        avgLastDay: null,
        avgToday: null
    }

    //Return
    return {
		
		//Generate dateId and date
		generateDateIDAndDate: function(day, month, year){
			if(day < 10){
                day = `0${day}`;
            }
			if(month < 10){
                month = `0${month + 1}`;
            }
			let dateID = `${year}${month}${day}`;
            dateID = parseInt(dateID);            
            let nowDate = `${month}-${day}-${year}`;
            nowDate.toString();
			return {
				dateID,
				nowDate
			}
		},
		
		//Today's Date
		initDate: function(){
			let date = new Date();
			let day = date.getDate();
			let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			let month = date.getMonth();
			let year = date.getFullYear();
			console.log('year: '+year);
		
			document.querySelector('#month-span').innerHTML = months[date.getMonth()];
			document.querySelector('#date-span').innerHTML = day;
			
			let dateID = this.generateDateIDAndDate(day, month, year).dateID;
            //dateID = parseInt(dateID);            
            let nowDate = this.generateDateIDAndDate(day, month, year).nowDate;
            //nowDate.toString();
           
            data.currentDateID = dateID;
            data.currentDate = nowDate;
		},

        //Set Date
        setDate: function(Day, Month, Year){
            let day = Day;
            let month = Month;
            let year = Year;
            //console.log('Setting the date');
            let dateID = `${year}${month}${day}`;
            dateID = parseInt(dateID);
            let nowDate = `${month}-${day}-${year}`;
            //console.log('datenow: '+nowDate);
            
            // dateSet = {
            //     date_ID: dateID,
            //     date: nowDate
            // }
            // this.getDate(dateID, nowDate, sample);
            data.currentDateID = dateID;
            data.currentDate = nowDate;
        },
		
        //Getting the items from DS
        getItems: function(){
            //console.log('items retrived');
            return data.items;
        },

        //Add item to list
        addItem: function(before, after, dateid, date){
                
			let ID;
			if(data.items.length > 0){
				ID = data.items[data.items.length - 1].id + 1;
			} else{
				ID = 0;
			}
			//console.log('From ItemCtrl.addItem() '+ dateid );
			//console.log('From ItemCtrl.addItem() '+ date );
			let time = data.currentTime;
			//console.log(time);
			newItem = new Item(ID, before, after, dateid, date, time);
			data.items.push(newItem);
			//console.log('From ItemCtrl.addItem()');
			//console.log(data.items);
			return newItem;
        },

        //Select the time
        selectTime: function(time){
            switch(time){
                case 0:
                    data.currentTime = 0;
                    break;
                case 1:
                    data.currentTime = 1;
                    break;
                case 2:
                    data.currentTime = 2;
                    break;
                default :
                    alert('Select the timing...!');
                    break;
            }
        },

        //Getting time from Data
        getTime: function(){
            return data.currentTime;
        },
		
		//Setting current input
		setCurrentBefAft: function(bef, aft){
			data.currentBefore = bef;
			data.currentAfter = aft;
		},
		
		//Average of Today
		todayAvg: function(){
			let todayDate = new Date();
			let day = todayDate.getDate();
			let month = todayDate.getMonth();
			let year = todayDate.getFullYear();
			
			let dateID = this.generateDateIDAndDate(day, month, year).dateID;            
            //let nowDate = this.generateDateIDAndDate(day, month, year).nowDate;
			
			let found = data.items.find(function(item){
				return item.date_id == dateID;
            });

            console.log(found);
            
			let todayMornArr = [];
            let todayAftArr = [];
            let todayNigArr = [];

            todayMornArr.push(found.morn_before,  found.morn_after);
            todayAftArr.push(found.aft_before, found.aft_after);
            todayNigArr.push(found.nig_before,  found.nig_after);

            todayMornArr = todayMornArr.filter(i => {
                return i != '';
            });
            todayAftArr = todayAftArr.filter(i => {
                return i != '';
            });
            todayNigArr = todayNigArr.filter(i => {
                return i != '';
            });
            
            let mornAdd = todayMornArr.reduce((a, c) => {
				return a + c;
            }, 0);
            let aftAdd = todayAftArr.reduce((a, c) => {
				return a + c;
            }, 0);
            let nigAdd = todayNigArr.reduce((a, c) => {
				return a + c;
            }, 0);

            console.log(mornAdd, aftAdd, nigAdd);
			
			if(mornAdd){
                mornAvg = parseInt(mornAdd / todayMornArr.length);
            } else {
                mornAvg = 'NIL';
            }

            if(aftAdd){
                aftAvg = parseInt(aftAdd / todayAftArr.length);
            } else {
                aftAvg = 'NIL';
            }

            if(nigAdd){
                nigAvg = parseInt(nigAdd / todayNigArr.length);
            } else {
                nigAvg = 'NIL';
            }

            console.log(mornAvg, aftAvg, nigAvg);

			document.querySelector('.today').children[2].innerHTML = mornAvg;
            document.querySelector('.today').children[1].innerHTML = aftAvg;
            document.querySelector('.today').children[0].innerHTML = nigAvg;
		},
		
		//Average of last week
		lastDayAvg: function(){
			let todayDate = new Date();
			let day = todayDate.getDate() - 1;		
			let month = todayDate.getMonth();
			let year = todayDate.getFullYear();
			if(day < 1) month - 1;
			if(month < 1) year - 1;
			
			let dateID = this.generateDateIDAndDate(day, month, year).dateID;            
            let nowDate = this.generateDateIDAndDate(day, month, year).nowDate;
			
			let found = data.items.find(function(item){
				return item.date_id == dateID;
            });

            console.log(found);
            
            
			let yesterdayMornArr = [];
            let yesterdayAftArr = [];
            let yesterdayNigArr = [];

            yesterdayMornArr.push(found.morn_before,  found.morn_after);
            yesterdayAftArr.push(found.aft_before, found.aft_after);
            yesterdayNigArr.push(found.nig_before,  found.nig_after);

            yesterdayMornArr = yesterdayMornArr.filter(i => {
                return i != '';
            });
            yesterdayAftArr = yesterdayAftArr.filter(i => {
                return i != '';
            });
            yesterdayNigArr = yesterdayNigArr.filter(i => {
                return i != '';
            });
            
            let mornAdd = yesterdayMornArr.reduce((a, c) => {
				return a + c;
            }, 0);
            let aftAdd = yesterdayAftArr.reduce((a, c) => {
				return a + c;
            }, 0);
            let nigAdd = yesterdayNigArr.reduce((a, c) => {
				return a + c;
            }, 0);

            console.log(mornAdd, aftAdd, nigAdd);

			
			if(mornAdd){
                mornAvg = parseInt(mornAdd / yesterdayMornArr.length);
            } else {
                mornAvg = 'NIL';
            }

            if(aftAdd){
                aftAvg = parseInt(aftAdd / yesterdayAftArr.length);
            } else {
                aftAvg = 'NIL';
            }

            if(nigAdd){
                nigAvg = parseInt(nigAdd / yesterdayNigArr.length);
            } else {
                nigAvg = 'NIL';
            }

            console.log(mornAvg, aftAvg, nigAvg);

			document.querySelector('.yesterday').children[2].innerHTML = mornAvg;
            document.querySelector('.yesterday').children[1].innerHTML = aftAvg;
            document.querySelector('.yesterday').children[0].innerHTML = nigAvg;
        },
        
        //last week
        lastWeekAvg: function(){

            let today = new Date();
            let day = today.getDay();

            let first = new Date(today.getTime() -((day + 7) * 24 * 60 * 60 * 1000));
            let last = new Date(today.getTime() - ((day + 1) * 24 * 60 * 60 * 1000));

            let fWeek = new Date(first).toLocaleDateString();
            let lWeek = new Date(last).toLocaleDateString();

            
            let ms = new Date(fWeek).getMonth() + 1;
            let ds = new Date(fWeek).getDate();
            let ys = new Date(fWeek).getFullYear();

            let ml = new Date(lWeek).getMonth() + 1;
            let dl = new Date(lWeek).getDate();
            let yl = new Date(lWeek).getFullYear();

            if(ms < 10){
                ms = `0${ms}`;
            }
            if(ds  < 10){
                ds = `0${ds}`;
            }

            if(ml < 10){
                ml = `0${ml}`;
            }
            if(dl < 10){
                dl = `0${dl}`;
            }

            let end = `${ys}${ms}${ds}`;
            
            let start = `${yl}${ml}${dl}`;

            let found = ItemCtrl.getItems().filter(i => {
                return i.date_id <= start && i.date_id >= end;
            });

            console.log(fWeek, lWeek);
            console.log(start, end);
            console.log(found);

            let weekMornArr = [];
            let weekAftArr = [];
            let weekNigArr = [];

            found.forEach(item => {
                console.log(item);
                weekMornArr.push(item.morn_before,  item.morn_after);
                weekAftArr.push(item.aft_before, item.aft_after);
                weekNigArr.push(item.nig_before,  item.nig_after);
            });

            weekMornArr = weekMornArr.filter(i => {
                return i != '';
            });
            weekAftArr = weekAftArr.filter(i => {
                return i != '';
            });
            weekNigArr = weekNigArr.filter(i => {
                return i != '';
            });
            
            let mornAdd = weekMornArr.reduce((a, c) => {
				return a + c;
            }, 0);
            let aftAdd = weekAftArr.reduce((a, c) => {
				return a + c;
            }, 0);
            let nigAdd = weekNigArr.reduce((a, c) => {
				return a + c;
            }, 0);

            console.log(mornAdd, aftAdd, nigAdd);

            if(mornAdd){
                mornAvg = parseInt(mornAdd / weekMornArr.length);
            } else {
                mornAvg = 'NIL';
            }

            if(aftAdd){
                aftAvg = parseInt(aftAdd / weekAftArr.length);
            } else {
                aftAvg = 'NIL';
            }

            if(nigAdd){
                nigAvg = parseInt(nigAdd / weekNigArr.length);
            } else {
                nigAvg = 'NIL';
            }
       
            console.log(mornAvg, aftAvg, nigAvg);

            document.querySelector('.lastweek').children[2].innerHTML = mornAvg;
            document.querySelector('.lastweek').children[1].innerHTML = aftAvg;
            document.querySelector('.lastweek').children[0].innerHTML = nigAvg;
        },

        //last month
        lastMonth: function(){
            let currentDate = new Date();
            let month = currentDate.getMonth();
            let year = currentDate.getFullYear();


            if(month == 0){
                found = ItemCtrl.getItems().filter(d => {
                    a = new Date(d.f_date);
                    return a.getMonth() == 11 && a.getFullYear() == year - 1;
                });
            } else {
                found = ItemCtrl.getItems().filter(d => {
                    a = new Date(d.f_date);
                    return a.getMonth() == month -1 && a.getFullYear() == year;
                });
            }

            console.log(found);
            
            let monthMornArr = [];
            let monthAftArr = [];
            let monthNigArr = [];

            found.forEach(item => {
                monthMornArr.push(item.morn_before,  item.morn_after);
                monthAftArr.push(item.aft_before, item.aft_after);
                monthNigArr.push(item.nig_before,  item.nig_after);
            });

            monthMornArr = monthMornArr.filter(i => {
                return i != '';
            });
            monthAftArr = monthAftArr.filter(i => {
                return i != '';
            });
            monthNigArr = monthNigArr.filter(i => {
                return i != '';
            });
            
            let mornAdd = monthMornArr.reduce((a, c) => {
				return a + c;
            }, 0);
            let aftAdd = monthAftArr.reduce((a, c) => {
				return a + c;
            }, 0);
            let nigAdd = monthNigArr.reduce((a, c) => {
				return a + c;
            }, 0);

            console.log(mornAdd, aftAdd, nigAdd);

            if(mornAdd){
                mornAvg = parseInt(mornAdd / monthMornArr.length);
            } else {
                mornAvg = 'NIL';
            }

            if(aftAdd){
                aftAvg = parseInt(aftAdd / monthAftArr.length);
            } else {
                aftAvg = 'NIL';
            }

            if(nigAdd){
                nigAvg = parseInt(nigAdd / monthNigArr.length);
            } else {
                nigAvg = 'NIL';
            }
       
            console.log(mornAvg, aftAvg, nigAvg);

            document.querySelector('.lastmonth').children[2].innerHTML = mornAvg;
            document.querySelector('.lastmonth').children[1].innerHTML = aftAvg;
            document.querySelector('.lastmonth').children[0].innerHTML = nigAvg;
            
        },

        //Log Data
        logData: function(){
            return data;
        }
    }
})();

//UI Control
const UICtrl = (function(){

    //UI Selectors
    const UISelectors = {
        itemList: '#list-item',
        listItems: '#list-item li',
        addBtn: '#add-gluco',
        beforeInput: '#bf-fasting',
        afterInput: '#af-fasting',
        morning: '.morning',
        afternoon: '.afternoon',
        night: '.night',
        morBtn: '#mor-btn',
        lunBtn: '#lun-btn',
        dinBtn: '#din-btn',
        calendar: '#calendar-btn',
		table: '.table-logo'
    }
    
    //Return
    return {
		
		//Populate list items
		populateListItems: function(items){
			document.querySelector(UISelectors.itemList).style.display = 'block';
			let html = `<li class="list-group-item list-item-items">
				<strong class="list-date">DATE</strong>
				<div class="morning-head li-head">
					<span class="time-title"><strong>MORNING</strong></span>
					<span class="before-head">Before</span>
					<span class="after-head">After</span>
				</div>
				<div class="afternoon-head li-head">
					<span class="time-title"><strong>AFTERNOON</strong></span>
					<span class="before-head">Before</span>
					<span class="after-head">After</span>
				</div>
				<div class="night-head li-head">
					<span class="time-title"><strong>NIGHT</strong></span>
					<span class="before-head">Before</span>
					<span class="after-head">After</span>
				</div>
				</li>`;
				
				
			let sortedDate = items.sort(function(a, b){
				return b.date_id - a.date_id;
			});
			console.log(sortedDate);

			sortedDate.forEach(function(item){
				html += `<li class="list-group-item list-item-items" id=item-${item.id}>
					<strong class="list-date">${item.f_date}</strong>
					<div class="morning">
						<div class="morning-inner">
							<em id="m-before">${item.morn_before}</em>
							<em id="m-after">${item.morn_after}</em>
						</div>
					</div>
					<div class="afternoon">
						<div class="afternoon-inner">
							<em id="a-before">${item.aft_before}</em>
							<em id="a-after">${item.aft_after}</em>
						</div>
					</div>
					<div class="night">
						<div class="night-inner">
							<em id="n-before">${item.nig_before}</em>
							<em id="n-after">${item.nig_after}</em>
						</div>
					</div>
				</li>`;
			});
            
			
			document.querySelector(UISelectors.itemList).innerHTML = html;		
			
		},
        
        //Getting input from UI
        getItemInput: function(){
            //console.log('Getting item input');
            return {
                before: document.querySelector(UISelectors.beforeInput).value,
                after: document.querySelector(UISelectors.afterInput).value
            }
        },
		
		//Set Current Before and After
		setCurrentBefAft: function(){
			currentBefore = document.querySelector(UISelectors.beforeInput).value;
			currentAfter = document.querySelector(UISelectors.afterInput).value;
			ItemCtrl.setCurrentBefAft(currentBefore, currentAfter);
		},

        //Getting date from UI
        getDateInput: function(clickedDay, clickedMonth, clickedYear){
            //console.log('Getting date input from calendar:');
            //console.log(`${clickedYear}-${clickedMonth}-${clickedDay}`);
            let Day = clickedDay;
            let Month = clickedMonth;
            let Year = clickedYear;
            //console.log(Day);
            //console.log(Month);
            //console.log(Year);
            ItemCtrl.setDate(Day, Month, Year);
        },

        //Add item to UI
        addListItem: function(item){
            //console.log(item);
            document.querySelector(UISelectors.itemList).style.display = 'block';
            const li = document.createElement('li');
            li.className = 'list-group-item list-item-items';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong class="list-date">${item.f_date}</strong>
					<div class="morning">
						<div class="morning-inner">
							<em id="m-before">${item.morn_before}</em>
							<em id="m-after">${item.morn_after}</em>
						</div>
					</div>
					<div class="afternoon">
						<div class="afternoon-inner">
							<em id="a-before">${item.aft_before}</em>
							<em id="a-after">${item.aft_after}</em>
						</div>
					</div>
					<div class="night">
						<div class="night-inner">
							<em id="n-before">${item.nig_before}</em>
							<em id="n-after">${item.nig_after}</em>
						</div>
					</div>`;

            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
			setTimeout(function(){
				document.querySelector(`#item-${item.id}`).remove();
				document.querySelector(UISelectors.itemList).style.display = 'none';
			}, 3000);

            console.log(item);

        },

        //Selecting the current time
        selectCurrentTime: function(){
            let time = ItemCtrl.getTime();
            return time;
        },

        //Hiding the calendar from UI
        hideCalendar: function(){
            document.querySelector('#calendar-show').style.display = 'none';
            document.querySelector('#main-container').style.display = 'block';
            //console.log('calendar hided...');
        },

        //Enabling and Showing the calendar
        showCalendarUI: function(){

            document.querySelector('#main-container').style.display = 'none';
            document.querySelector('#calendar-show').style.display = 'grid';

            let today = new Date();
            let currentMonth = today.getMonth();
            let currentYear = today.getFullYear();

            let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            let monthAndYear = document.getElementById("monthAndYear");
            showCalendar(currentMonth, currentYear);

            //listener
            let prev_btn = document.getElementById('prev');
            prev_btn.addEventListener('click', previous);
            let next_btn = document.getElementById('next');
            next_btn.addEventListener('click', next);
            let cell_btn = document.querySelector('#date-display');
            cell_btn.addEventListener('click', selectedDate);
            //previous btn
            function previous(){
                currentYear = (currentMonth === 0) ? currentYear-1 : currentYear;
                currentMonth = (currentMonth === 0) ? 11 : currentMonth-1;
                showCalendar(currentMonth, currentYear);
                //console.log('prev..');
            }

            //next btn
            function next(){
                currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
                currentMonth = (currentMonth + 1) % 12;
                showCalendar(currentMonth, currentYear);
                //console.log('next..');
            }

            //Selected date
            function selectedDate(e){
                if(e.target.classList.contains('cell-btn')){
                    //console.log('Date selected...');
                    let clickedDay = e.target.textContent;
                    let clickedMonth = currentMonth + 1;
                    let clickedYear = currentYear;
                    //console.log(clickedDay+'-'+clickedMonth+'-'+clickedYear);
                    
                    // let correct = document.querySelectorAll('.btn .cell-btn').innerText;
                    // console.log('alal: '+correct);
                    if(clickedDay < 10){
                        clickedDay = `0${clickedDay}`;
                    }
                    if(clickedMonth < 10){
                        clickedMonth = `0${clickedMonth}`;
                    }
                    UICtrl.getDateInput(clickedDay, clickedMonth, clickedYear);
                    document.querySelector('.month-panel').firstChild.innerHTML = `${months[currentMonth]}`;
                    document.querySelector('.date-panel').firstChild.innerHTML = `${clickedDay}`;
                    UICtrl.hideCalendar();
                }
                
            }
            //display calendar
            function showCalendar(month, year){
                let firstDay = (new Date(year, month)).getDay();
                let daysInMonth = 32 - new Date(year, month, 32).getDate();
                //calendar body
                let calendar = document.getElementById("date-display");

                //clearing all previous cell
                calendar.innerHTML = "";

                //filling the data
                monthAndYear.innerHTML = months[month] + " " + year;
                //creating all cells
                let date = 1;
                for(let i=0; i<6; i++){
                    //creating the rows
                    let rows = document.createElement("tr");

                    //creating individual cells
                    for(let j=0; j<7; j++){
                        if(i === 0 && j < firstDay){
                            let cell = document.createElement("div");
                            let cellText = document.createTextNode("");
                            cell.appendChild(cellText);
                            rows.appendChild(cell);
                        }
                        else if(date > daysInMonth){
                            break;
                        }
                        else{
                            
                            let cell = document.createElement("div");
                            let cell_btn = document.createElement("button")
                            cell_btn.className = "btn cell-btn"
                            let cellText = document.createTextNode(date);
                            if(date === today.getDate() && year === today.getFullYear() && month === today.getMonth()){
                                //color effect
                    
                                cell_btn.classList.add("btn");
                    
                            }
                            cell.appendChild(cell_btn);
                            cell_btn.appendChild(cellText);
                            rows.appendChild(cell);
                            date++;
                        }
                    }
                    calendar.appendChild(rows);
                }
                //console.log('calendar created');
            }
            //console.log(currentMonth, currentYear);
        },
		
		//Show table UI
		showTableUI: function(){
			document.querySelector('#main-row').style.display = 'none';
			let items = ItemCtrl.getItems();
			this.populateListItems(items);
        },
        
        //Hide table UI
        hideTableUI: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
            document.querySelector('#main-row').style.display = 'block';
        },

        //Clear the input fields
        clearInput: function(){
            document.querySelector(UISelectors.beforeInput).value = '';
            document.querySelector(UISelectors.afterInput).value = '';
            //console.log('cleared');
        },

        //Hiding the entire lists from UI
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
            //console.log('Lists hided');
        },

        //Getting the UISelectors for access
        getSelectors: function(){
            return UISelectors;
        },

        //Actiate Average panel
        averagePanel: function(){
            let items = ItemCtrl.getItems();

            if( items.length != 0){
                if(new Date(items[0].f_date).toLocaleDateString() == new Date().toLocaleDateString()){
                    ItemCtrl.todayAvg();
                }

                let today = new Date();
                let yesterday = new Date().setDate(today.getDate() -1);
                console.log(new Date(yesterday).toLocaleDateString());

                let d =items.find(i => {
                    return (new Date(i.f_date).toLocaleDateString()) == (new Date(yesterday).toLocaleDateString());
                });
                console.log(d);
                if(d){
                    ItemCtrl.lastDayAvg();
                }
                
                ItemCtrl.lastWeekAvg();
                ItemCtrl.lastMonth();
            }
        }
    }
})();

//App Control
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl){
	
	const UISelectors = UICtrl.getSelectors();
	console.log('UISelectors: '+UISelectors.itemList);

    //Load the event listeners
    const loadEventListeners = function(){
        console.log('Event loaded successfully');

        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });
        document.querySelector(UISelectors.calendar).addEventListener('click', enableCalendar);
        document.querySelector('.table-logo').addEventListener('click', enableTable);
        document.querySelector('.home-logo').addEventListener('click', backToHome);
        document.querySelector(UISelectors.morBtn).addEventListener('click', selectBreakFastSubmit);
        document.querySelector(UISelectors.lunBtn).addEventListener('click', selectLunchSubmit);
        document.querySelector(UISelectors.dinBtn).addEventListener('click', selectDinnerSubmit);
        document.querySelector(UISelectors.addBtn).addEventListener('click', addItemSubmit);        
    }
	
	const enableTable = function(e){
		console.log('Showing the table');
		UICtrl.showTableUI();
		e.preventDefault();		
    }
    
    const backToHome = function(e){
        UICtrl.hideTableUI();
        console.log('home');
        e.preventDefault();
    }

    const addItemSubmit = function(e){

        console.log('Add Button Clicked');
		
        const input = UICtrl.getItemInput();
        console.log('input: '+input);
        console.log('input: '+input.before);
        console.log('input: '+input.after);

        const date = ItemCtrl.logData().currentDate;
        const dateid = ItemCtrl.logData().currentDateID;
        console.log('date: ' +date);
        console.log('date: ' +dateid);
		
		input.before = parseInt(input.before);
		input.after = parseInt(input.after);
		
		if(ItemCtrl.logData().items.length !== 0){
			console.log('Items available');
			//let flag = 1;
			let count = 0;
			let item
			let flag = ItemCtrl.logData().items.forEach(itm =>{
				console.log(itm.date_id, dateid);
				
				if(itm.date_id === dateid){
					return item = itm, count = 1;
				}
			});
			//console.log('flag: '+flag);
			if(count !== 1){
				console.log('Items available and create');
				console.log('flag > 1: '+flag);
				const newItem = ItemCtrl.addItem(input.before, input.after, dateid, date);
				console.log('newItem: '+newItem);
				UICtrl.addListItem(newItem);
				StorageCtrl.storeItem(newItem);
				UICtrl.averagePanel();
			} else{
				console.log('Items available and dont create');
				console.log('flag else: '+flag);
				console.log(item.id);
				document.querySelector(UISelectors.itemList).style.display = 'block';
				console.log('displaying');
				let time = ItemCtrl.logData().currentTime;
				
				const li = document.createElement('li');
				li.className = 'list-group-item list-item-items';
				li.id = `item-${item.id}`;
				switch(time){
					case 0:
						item.morn_before = input.before;
						item.morn_after = input.after;
						
						
						li.innerHTML = `<strong class="list-date">${item.f_date}</strong>
								<div class="morning">
									<div class="morning-inner">
										<em id="m-before">${item.morn_before}</em>
										<em id="m-after">${item.morn_after}</em>
									</div>
								</div>
								<div class="afternoon">
									<div class="afternoon-inner">
										<em id="a-before">${item.aft_before}</em>
										<em id="a-after">${item.aft_after}</em>
									</div>
								</div>
								<div class="night">
									<div class="night-inner">
										<em id="n-before">${item.nig_before}</em>
										<em id="n-after">${item.nig_after}</em>
									</div>
								</div>`;

						document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
						
						document.querySelector(`#item-${item.id}`).children[1].children[0].children[0].innerText = item.morn_before;
						document.querySelector(`#item-${item.id}`).children[1].children[0].children[1].innerText = item.morn_after;
						break;
					case 1:
						item.aft_before = input.before;
						item.aft_after = input.after;

						li.innerHTML = `<strong class="list-date">${item.f_date}</strong>
								<div class="morning">
									<div class="morning-inner">
										<em id="m-before">${item.morn_before}</em>
										<em id="m-after">${item.morn_after}</em>
									</div>
								</div>
								<div class="afternoon">
									<div class="afternoon-inner">
										<em id="a-before">${item.aft_before}</em>
										<em id="a-after">${item.aft_after}</em>
									</div>
								</div>
								<div class="night">
									<div class="night-inner">
										<em id="n-before">${item.nig_before}</em>
										<em id="n-after">${item.nig_after}</em>
									</div>
								</div>`;

						document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
						
						console.log(document.querySelector(`#item-${item.id}`));
						document.querySelector(`#item-${item.id}`).children[2].children[0].children[0].innerText = item.aft_before;
						document.querySelector(`#item-${item.id}`).children[2].children[0].children[1].innerText = item.aft_after;
						break;
					case 2:
						item.nig_before = input.before;
						item.nig_after = input.after;

						li.innerHTML = `<strong class="list-date">${item.f_date}</strong>
								<div class="morning">
									<div class="morning-inner">
										<em id="m-before">${item.morn_before}</em>
										<em id="m-after">${item.morn_after}</em>
									</div>
								</div>
								<div class="afternoon">
									<div class="afternoon-inner">
										<em id="a-before">${item.aft_before}</em>
										<em id="a-after">${item.aft_after}</em>
									</div>
								</div>
								<div class="night">
									<div class="night-inner">
										<em id="n-before">${item.nig_before}</em>
										<em id="n-after">${item.nig_after}</em>
									</div>
								</div>`;

						document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

						document.querySelector(`#item-${item.id}`).children[3].children[0].children[0].innerText = item.nig_before;
						document.querySelector(`#item-${item.id}`).children[3].children[0].children[1].innerText = item.nig_after;
						break;
				};
				let id = item.id
				StorageCtrl.updateItemStorage(id, input.before, input.after, time);
                console.log('UISelectors: '+UISelectors.itemList);
                
                UICtrl.averagePanel();
				
				setTimeout(function(){
					document.querySelector(`#item-${item.id}`).remove();
					document.querySelector(UISelectors.itemList).style.display = 'none';
				}, 3000);
				ItemCtrl.todayAvg();
			}
	
			
				
		} else{
			console.log('Items null and create');
			const newItem = ItemCtrl.addItem(input.before, input.after, dateid, date);
			console.log('newItem: '+newItem);
			UICtrl.addListItem(newItem);
			StorageCtrl.storeItem(newItem);
			UICtrl.averagePanel();
		}

        
        UICtrl.clearInput();

        e.preventDefault();
    }

    const selectBreakFastSubmit = function(){
        ItemCtrl.selectTime(0);
    }

    const selectLunchSubmit = function(){
        ItemCtrl.selectTime(1);
    }

    const selectDinnerSubmit = function(){
        ItemCtrl.selectTime(2);
    }

    const enableCalendar = function(e){
        console.log('showing the Calendar');
        UICtrl.showCalendarUI();
    }
    
    //Return
    return {
        init: function(){
			ItemCtrl.initDate();
            UICtrl.hideCalendar();
            UICtrl.clearInput();
            const items = ItemCtrl.getItems();
            console.log('Initially retrieved items'+ ItemCtrl.logData());
            
            UICtrl.hideList();
			if(items.length !== 0){

                let sortedDate = items.sort(function(a, b){
                    return b.date_id - a.date_id;
                });

                UICtrl.averagePanel();

                console.log(sortedDate);
			}
            
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

//App initialization
AppCtrl.init();