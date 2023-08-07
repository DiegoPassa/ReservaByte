import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, CdkDrag],
})
export class TestComponent {
  obj = [
    {
      firstName: 'Diego',
      lastName: 'Passarella',
      role: 'admin',
    },
    {
      firstName: 'Marco',
      lastName: 'Chinellato',
      role: 'bartender',
    },
    {
      firstName: 'Giulia',
      lastName: 'Cogotti',
      role: 'cook',
    },
    {
      firstName: 'Leonardo',
      lastName: 'Fusato',
      role: 'waiter',
    },
  ];

  orders = [
    {
      "_id": {
        "$oid": "64c9726cc36797e77ea2e93c"
      },
      "menu": {
        "name": "vino bianco",
        "price": 7.99,
        "ingredients": [
          "vino"
        ],
        "portionSize": 33,
        "preparationTime": 1,
        "totalOrders": 51,
        "type": "drink",
        "_id": {
          "$oid": "64c6a289ee636cd97ec6c65a"
        }
      },
      "table": {
        "$oid": "64c6b4f0aca3fda6feb2c022"
      },
      "createdAt": {
        "$date": "2023-08-01T21:00:15.120Z"
      },
      "completed": false,
      "estimatedCompletation": {
        "$date": "2023-08-01T21:01:15.120Z"
      }
    },
    {
      "_id": {
        "$oid": "64c9726cc36797e77ea2e93c"
      },
      "menu": {
        "name": "vino bianco",
        "price": 7.99,
        "ingredients": [
          "vino"
        ],
        "portionSize": 33,
        "preparationTime": 1,
        "totalOrders": 51,
        "type": "drink",
        "_id": {
          "$oid": "64c6a289ee636cd97ec6c65a"
        }
      },
      "table": {
        "$oid": "64c6b4f0aca3fda6feb2c022"
      },
      "createdAt": {
        "$date": "2023-08-01T21:00:15.120Z"
      },
      "completed": false,
      "estimatedCompletation": {
        "$date": "2023-08-01T21:01:15.120Z"
      }
    },
    {
      "_id": {
        "$oid": "64c9726cc36797e77ea2e93c"
      },
      "menu": {
        "name": "vino bianco",
        "price": 7.99,
        "ingredients": [
          "vino"
        ],
        "portionSize": 33,
        "preparationTime": 1,
        "totalOrders": 51,
        "type": "drink",
        "_id": {
          "$oid": "64c6a289ee636cd97ec6c65a"
        }
      },
      "table": {
        "$oid": "64c6b4f0aca3fda6feb2c022"
      },
      "createdAt": {
        "$date": "2023-08-01T21:00:15.120Z"
      },
      "completed": false,
      "estimatedCompletation": {
        "$date": "2023-08-01T21:01:15.120Z"
      }
    },
    {
      "_id": {
        "$oid": "64c9726cc36797e77ea2e93c"
      },
      "menu": {
        "name": "vino bianco",
        "price": 7.99,
        "ingredients": [
          "vino"
        ],
        "portionSize": 33,
        "preparationTime": 1,
        "totalOrders": 51,
        "type": "drink",
        "_id": {
          "$oid": "64c6a289ee636cd97ec6c65a"
        }
      },
      "table": {
        "$oid": "64c6b4f0aca3fda6feb2c022"
      },
      "createdAt": {
        "$date": "2023-08-01T21:00:15.120Z"
      },
      "completed": false,
      "estimatedCompletation": {
        "$date": "2023-08-01T21:01:15.120Z"
      }
    },
  ];
}
