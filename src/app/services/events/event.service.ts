import { Injectable, signal, computed } from '@angular/core';
import { Event } from '../../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventSignal = signal<Event[]>([]);
  events = this.eventSignal.asReadonly();
  eventCount = computed(() => this.eventSignal().length);

  constructor() {
    this.loadFromLocalStorage();
  }

  private save(){
    localStorage.setItem('events', JSON.stringify(this.eventSignal()));
  }

  private loadFromLocalStorage() {
    const saved = localStorage.getItem('events');
    if (saved) {
      try {
        const parsedEvents = JSON.parse(saved);
        this.eventSignal.set(parsedEvents);
      } catch (error) {
        console.error(`Error al cargar los eventos de localStorage: ${error}`);
        this.eventSignal.set([]);
      }

    }
  }

  addEvent(title: string, date: string) {
    const newEvent: Event = {
      id: crypto.randomUUID(),
      title,
      start: date,
      allDay: true
    };
    this.eventSignal.update(prev => [...prev, newEvent]);
    this.save();
  }

  removeEvent(id: string) {
    this.eventSignal.update(ev => ev.filter(e => e.id !== id));
    this.save();
  }
}
