from faker import Faker
from pymongo import MongoClient
from datetime import datetime, timedelta
import random

fake = Faker('en_IN')
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["ghost-worker-detector"]

# clear existing data
db.employees.delete_many({})
db.attendances.delete_many({})
db.payrolls.delete_many({})
db.leaves.delete_many({})

print("Cleared existing data...")

WORKPLACE = {"latitude": 23.0225, "longitude": 72.5714}
ROLES = ["Machine Operator", "Supervisor", "Helper", "Security Guard", "Accountant", "Driver", "Cleaner", "Technician"]
TOTAL_WORKERS = 50
GHOST_WORKERS = 10  # 20% ghost workers

employees = []
for i in range(TOTAL_WORKERS):
    emp = {
        "name": fake.name(),
        "phone": fake.unique.numerify('9#########'),
        "role": random.choice(ROLES),
        "dailyWage": random.choice([400, 500, 600, 700, 800]),
        "joiningDate": datetime(2026, 1, 1),
        "workplaceLocation": WORKPLACE,
        "status": "active",
        "ghostRiskScore": 0,
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    }
    employees.append(emp)

result = db.employees.insert_many(employees)
emp_ids = result.inserted_ids
print(f"Created {TOTAL_WORKERS} employees...")

# mark last 10 as ghost workers
ghost_ids = emp_ids[-GHOST_WORKERS:]
normal_ids = emp_ids[:-GHOST_WORKERS]

# generate 3 months of attendance
start_date = datetime(2026, 4, 1)
end_date = datetime(2026, 6, 30)

attendance_records = []
current_date = start_date

while current_date <= end_date:
    # skip sundays
    if current_date.weekday() != 6:
        
        # normal workers - attend most days
        for emp_id in normal_ids:
            if random.random() > 0.1:  # 90% attendance
                attendance_records.append({
                    "employee": emp_id,
                    "date": current_date,
                    "checkInTime": current_date.replace(hour=9, minute=random.randint(0, 30)),
                    "deviceId": f"device-{str(emp_id)[-4:]}",
                    "location": WORKPLACE,
                    "isWithinGeofence": True,
                    "status": "present",
                    "createdAt": datetime.now(),
                    "updatedAt": datetime.now()
                })
        
        # ghost workers - rarely or never attend
        for emp_id in ghost_ids:
            if random.random() > 0.95:  # only 5% attendance
                attendance_records.append({
                    "employee": emp_id,
                    "date": current_date,
                    "checkInTime": current_date.replace(hour=9, minute=0),
                    "deviceId": f"device-shared-001",  # shared device - fraud signal
                    "location": {"latitude": 19.0760, "longitude": 72.8777},  # wrong location
                    "isWithinGeofence": False,
                    "status": "suspicious",
                    "createdAt": datetime.now(),
                    "updatedAt": datetime.now()
                })

    current_date += timedelta(days=1)

db.attendances.insert_many(attendance_records)
print(f"Created {len(attendance_records)} attendance records...")

# generate payroll for all employees (April, May, June)
payroll_records = []
for month in [4, 5, 6]:
    for i, emp_id in enumerate(emp_ids):
        emp = employees[i]
        is_ghost = emp_id in ghost_ids
        
        days_worked = random.randint(18, 25) if not is_ghost else 0
        expected = emp["dailyWage"] * days_worked
        amount_paid = emp["dailyWage"] * random.randint(20, 26)  # always paid full
        
        payroll_records.append({
            "employee": emp_id,
            "month": month,
            "year": 2026,
            "amountPaid": amount_paid,
            "daysWorked": days_worked,
            "expectedAmount": expected,
            "discrepancy": amount_paid != expected,
            "flagged": is_ghost,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })

db.payrolls.insert_many(payroll_records)
print(f"Created {len(payroll_records)} payroll records...")

print("\nDone! Summary:")
print(f"  Total employees: {TOTAL_WORKERS}")
print(f"  Normal workers: {TOTAL_WORKERS - GHOST_WORKERS}")
print(f"  Ghost workers: {GHOST_WORKERS}")
print(f"  Attendance records: {len(attendance_records)}")
print(f"  Payroll records: {len(payroll_records)}")
print(f"\nRun ML analysis at http://127.0.0.1:5001/ml/analyze to see Isolation Forest results")