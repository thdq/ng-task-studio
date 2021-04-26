import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalCreateTaskListComponent } from './modal-create-task-list.component'

describe('ModalCreateTaskListComponent', () => {
    let component: ModalCreateTaskListComponent
    let fixture: ComponentFixture<ModalCreateTaskListComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModalCreateTaskListComponent]
        })
            .compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalCreateTaskListComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
