import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { IndexComponent } from './index.component'

describe('IndexComponent', () => {
    let component: IndexComponent
    let fixture: ComponentFixture<IndexComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [IndexComponent]
        })
            .compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(IndexComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    test('Should create component', () => {

        expect(component).toBeTruthy()

    })
})
