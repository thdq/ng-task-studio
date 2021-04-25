import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { NavbarComponent } from './navbar.component'

describe('NavbarComponent', () => {
    let component: NavbarComponent
    let fixture: ComponentFixture<NavbarComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [NavbarComponent]
        })
            .compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    test('Should create component', () => {

        expect(component).toBeTruthy()

    })

    test('Should contains my-todo/home route page', () => {

        const wrapper: HTMLElement = fixture.debugElement.nativeElement

        const aboutRouteLink = wrapper.querySelector("[data-test=my-todo-home-router-link]")

        expect(aboutRouteLink.getAttribute('ng-reflect-router-link')).toBe('/my-todo/home')

    })

})
