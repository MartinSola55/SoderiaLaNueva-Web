import { Col, Row } from "react-bootstrap";
import { Button, Card, CheckBox, DealerDropdown, DeliveryDayDropdown, Input, InvoiceTypesDropdown, Label, Loader, Spinner, TaxConditionsDropdown } from "../../../components";
import { useNavigate } from "react-router";
import { useState } from "react";
import { handleOnSubmit } from "../Clients.helpers";

export const ClientInfo = ({
    form,
    loading,
    submiting,
    isWatching,
    onSubmit,
    onInputChange
}) => {
    const navigate = useNavigate();
    const [interalIsWatching, setInteralIsWatching] = useState(isWatching);

    return (
        <Card
            title='Cliente'
            body={loading ? <Spinner /> :
                <>
                    <Row className='align-items-center'>
                        <Col xs={12} className='pe-3 mb-3'>
                            <Label required={!interalIsWatching}>Nombre del cliente</Label>
                            <Input
                                value={form.name}
                                disabled={interalIsWatching}
                                onChange={(value) => onInputChange(value, 'name')}
                            />
                        </Col>
                        <Col xs={12} className='pe-3 mb-3'>
                            <Label required={!interalIsWatching}>Dirección</Label>
                            <Input
                                value={form.address}
                                disabled={interalIsWatching}
                                onChange={(value) => onInputChange(value, 'address')}
                            />
                        </Col>
                        <Col xs={12} className='pe-3 mb-3'>
                            <Label required={!interalIsWatching}>Teléfono</Label>
                            <Input
                                value={form.phone}
                                disabled={interalIsWatching}
                                onChange={(value) => onInputChange(value, 'phone')}
                            />
                        </Col>
                        <Col xs={12} className='pe-3 mb-3'>
                            <Label>Observaciones</Label>
                            <Input
                                tag='textarea'
                                value={form.observations}
                                disabled={interalIsWatching}
                                onChange={(value) => onInputChange(value, 'observations')}
                            />
                        </Col>
                        <Col xs={12} className='pe-3 mb-3'>
                            <Label>Repartidor</Label>
                            <DealerDropdown
                                value={form.dealerId}
                                disabled={interalIsWatching}
                                onChange={(value) => onInputChange(value, 'dealerId')}
                            />
                        </Col>
                        <Col xs={12} className='pe-3 mb-3'>
                            <Label>Día de reparto</Label>
                            <DeliveryDayDropdown
                                value={form.deliveryDay}
                                disabled={interalIsWatching}
                                onChange={(value) => onInputChange(value, 'deliveryDay')}
                            />
                        </Col>
						{isWatching && (
							<Col xs={12} className='pe-3 mb-3'>
								<Label>Deuda</Label>
								<Input
									value={form.debt}
									disabled={interalIsWatching}
									onChange={(value) => onInputChange(value, 'debt')}
								/>
							</Col>
						)}
                        <Col xs={12} className='pe-3 mb-3'>
                            <CheckBox
                                label='¿Quiere factura?'
                                name='hasInvoice'
                                value={form.hasInvoice}
                                checked={form.hasInvoice}
                                disabled={interalIsWatching}
                                onChange={(value) => onInputChange(value, 'hasInvoice')}
                            />
                        </Col>
                        {form.hasInvoice && (
                            <>
                                <Col xs={12} className='pe-3 mb-3'>
                                    <Label required={!interalIsWatching}>Tipo de factura</Label>
                                    <InvoiceTypesDropdown
                                        required={!interalIsWatching}
                                        value={form.invoiceType}
                                        disabled={interalIsWatching}
                                        onChange={(value) => onInputChange(value, 'invoiceType')}
                                    />
                                </Col>
                                <Col xs={12} className='pe-3 mb-3'>
                                    <Label required={!interalIsWatching}>
                                        Condición frente al IVA
                                    </Label>
                                    <TaxConditionsDropdown
                                        required={!interalIsWatching}
                                        value={form.taxCondition}
                                        disabled={interalIsWatching}
                                        onChange={(value) => onInputChange(value, 'taxCondition')}
                                    />
                                </Col>
                                <Col xs={12} className='pe-3 mb-3'>
                                    <Label required={!interalIsWatching}>CUIT</Label>
                                    <Input
                                        value={form.cuit}
                                        disabled={interalIsWatching}
                                        onChange={(value) => onInputChange(value, 'cuit')}
                                    />
                                </Col>
                            </>
                        )}
                    </Row>
                </>
            }
            footer={
                <div className={`d-flex justify-content-${isWatching ? 'between' : 'end'}`}>
					{!interalIsWatching ? (
						<>
							{isWatching && (
								<Button variant='danger' onClick={() => setInteralIsWatching(true)}>
									Cancelar
								</Button>
							)}
							<Button onClick={() => !isWatching ? onSubmit() : handleOnSubmit(onSubmit, setInteralIsWatching)} disabled={submiting}>
								{submiting ? <Loader /> : 'Guardar'}
							</Button>
						</>
                    ) : (
						<>
							<Button variant='secondary' className='me-2' onClick={() => navigate('/clientes/list')}>
								Volver
							</Button>
							<Button onClick={() => { setInteralIsWatching(false) }}>
								Editar
							</Button>
						</>
					)}
                </div>
            }
        />
    );
};